import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { jobsAPI } from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Loader2, Plus, X } from "lucide-react";

const schema = yup.object({
  title: yup.string().required("Job title is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(50, "Min 50 characters"),
  companyName: yup.string().required("Company name is required"),
  country: yup.string().required("Country is required"),
  jobType: yup.string().required("Job type is required"),
  industry: yup.string().required("Industry is required"),
});

const inputCls =
  "w-full px-4 py-2.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none";

const PostJobPage = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [reqInput, setReqInput] = useState("");
  const [benefits, setBenefits] = useState([]);
  const [benefitInput, setBenefitInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const addItem = (list, setList, input, setInput) => {
    if (input.trim() && !list.includes(input.trim())) {
      setList([...list, input.trim()]);
      setInput("");
    }
  };

  const removeItem = (list, setList, item) =>
    setList(list.filter((i) => i !== item));

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        company: { name: data.companyName, website: data.companyWebsite || "" },
        location: { country: data.country, city: data.city || "" },
        jobType: data.jobType,
        industry: data.industry,
        salary: {
          min: Number(data.salaryMin) || 0,
          max: Number(data.salaryMax) || 0,
          currency: data.salaryCurrency || "USD",
        },
        experience: {
          min: Number(data.experienceMin) || 0,
          max: Number(data.experienceMax) || 10,
          level: data.experienceLevel || "entry",
        },
        skills,
        requirements,
        benefits,
      };
      console.log("Submitting job with payload:", payload);
      await jobsAPI.createJob(payload);
      toast.success("Job posted successfully!");
      navigate("/dashboard/my-jobs");
    } catch (err) {
      console.error("Job creation error:", err);
      const message =
        err.response?.data?.message || err.message || "Failed to post job";
      toast.error(message);
    }
  };

  const onError = (errors) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fill in all required fields correctly");
  };

  const TagInput = ({ label, list, setList, input, setInput }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            (e.preventDefault(), addItem(list, setList, input, setInput))
          }
          placeholder="Type and press Enter"
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => addItem(list, setList, input, setInput)}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm px-2.5 py-1 rounded-full"
          >
            {item}{" "}
            <button
              type="button"
              onClick={() => removeItem(list, setList, item)}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Post a New Job
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="space-y-5 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 p-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Title *
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Senior React Developer"
              className={inputCls}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name *
              </label>
              <input
                {...register("companyName")}
                placeholder="Company name"
                className={inputCls}
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Website
              </label>
              <input
                {...register("companyWebsite")}
                placeholder="https://company.com"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country *
              </label>
              <input
                {...register("country")}
                placeholder="e.g. United States"
                className={inputCls}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <input
                {...register("city")}
                placeholder="e.g. New York"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Type *
              </label>
              <select {...register("jobType")} className={inputCls}>
                <option value="">Select type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
              {errors.jobType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.jobType.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Industry *
              </label>
              <input
                {...register("industry")}
                placeholder="e.g. Technology"
                className={inputCls}
              />
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.industry.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Salary
              </label>
              <input
                type="number"
                {...register("salaryMin")}
                placeholder="50000"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Salary
              </label>
              <input
                type="number"
                {...register("salaryMax")}
                placeholder="100000"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select {...register("salaryCurrency")} className={inputCls}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Description *
            </label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Describe the role, responsibilities..."
              className={`${inputCls} resize-none`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <TagInput
            label="Required Skills"
            list={skills}
            setList={setSkills}
            input={skillInput}
            setInput={setSkillInput}
          />
          <TagInput
            label="Requirements"
            list={requirements}
            setList={setRequirements}
            input={reqInput}
            setInput={setReqInput}
          />
          <TagInput
            label="Benefits"
            list={benefits}
            setList={setBenefits}
            input={benefitInput}
            setInput={setBenefitInput}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            Post Job
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostJobPage;
