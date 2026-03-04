import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobsAPI, applicationsAPI, savedAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../layouts/MainLayout";
import toast from "react-hot-toast";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Globe,
  Heart,
  ArrowLeft,
  Loader2,
  Users,
  Calendar,
} from "lucide-react";

const JobDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await jobsAPI.getJob(id);
      setJob(res.data.data);
    } catch {
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    setApplying(true);
    try {
      // Simple application without file upload
      await applicationsAPI.apply(id, { coverLetter });
      toast.success("Application submitted!");
      setShowApplyModal(false);
      setCoverLetter("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return navigate("/login");
    try {
      if (saved) {
        await savedAPI.unsaveJob(id);
        setSaved(false);
        toast.success("Removed from saved");
      } else {
        await savedAPI.saveJob(id);
        setSaved(true);
        toast.success("Job saved!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job");
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      </MainLayout>
    );

  if (!job) return null;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={18} /> Back to Jobs
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-20 h-20 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-3xl shrink-0">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt=""
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                job.company?.name?.charAt(0) || "C"
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {job.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                    {job.company?.name}
                  </p>
                  {job.company?.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 flex items-center gap-1 mt-1"
                    >
                      <Globe size={14} /> {job.company.website}
                    </a>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className={`p-2.5 border rounded-lg transition ${saved ? "border-red-300 bg-red-50 text-red-500" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300 hover:text-red-500"}`}
                  >
                    <Heart size={18} fill={saved ? "currentColor" : "none"} />
                  </button>
                  {user?.role !== "recruiter" && (
                    <button
                      onClick={() =>
                        isAuthenticated
                          ? setShowApplyModal(true)
                          : navigate("/login")
                      }
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div>
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="text-sm font-medium dark:text-white flex items-center gap-1">
                <MapPin size={14} /> {job.location?.country}
                {job.location?.city ? `, ${job.location.city}` : ""}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Job Type</p>
              <p className="text-sm font-medium dark:text-white flex items-center gap-1">
                <Briefcase size={14} /> {job.jobType?.replace("-", " ")}
              </p>
            </div>
            {job.salary?.min > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Salary</p>
                <p className="text-sm font-medium dark:text-white flex items-center gap-1">
                  <DollarSign size={14} /> {job.salary.min.toLocaleString()} -{" "}
                  {job.salary.max.toLocaleString()}/yr
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Applicants</p>
              <p className="text-sm font-medium dark:text-white flex items-center gap-1">
                <Users size={14} /> {job.applicantsCount}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Job Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>

          {job.requirements?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Requirements
              </h2>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm"
                  >
                    <span className="text-blue-600 mt-0.5">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span
                    key={s}
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.benefits?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Benefits
              </h2>
              <ul className="grid grid-cols-2 gap-2">
                {job.benefits.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm"
                  >
                    <span className="text-green-500">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Apply for {job.title}
            </h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cover Letter (optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  placeholder="Tell them why you're the perfect candidate..."
                  className="w-full px-4 py-2.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Note: Your application will be submitted with your profile
                information.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-2"
                >
                  {applying && <Loader2 size={16} className="animate-spin" />}{" "}
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default JobDetailPage;
