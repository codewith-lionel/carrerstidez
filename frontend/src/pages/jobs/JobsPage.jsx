import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import MainLayout from '../../layouts/MainLayout';
import { MapPin, Briefcase, DollarSign, Clock, Search, Filter } from 'lucide-react';

const JobCard = ({ job }) => (
  <Link to={`/jobs/${job._id}`} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5 hover:shadow-md transition group">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-xl">
          {job.company?.logo ? <img src={job.company.logo} alt="" className="w-full h-full object-contain rounded-lg" /> : job.company?.name?.charAt(0) || 'C'}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company?.name}</p>
        </div>
      </div>
      <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full capitalize whitespace-nowrap">{job.jobType?.replace('-', ' ')}</span>
    </div>
    <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location?.country}{job.location?.city ? `, ${job.location.city}` : ''}</span>
      <span className="flex items-center gap-1"><Briefcase size={14} /> {job.industry}</span>
      {job.salary?.min > 0 && (
        <span className="flex items-center gap-1">
          <DollarSign size={14} /> {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
        </span>
      )}
    </div>
    {job.skills?.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-1">
        {job.skills.slice(0, 4).map(s => (
          <span key={s} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{s}</span>
        ))}
        {job.skills.length > 4 && <span className="text-xs text-gray-400">+{job.skills.length - 4}</span>}
      </div>
    )}
    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(job.createdAt).toLocaleDateString()}</span>
      <span>{job.applicantsCount} applicants</span>
    </div>
  </Link>
);

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ search: '', country: '', industry: '', jobType: '', page: 1 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getJobs(filters);
      setJobs(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, page: 1 }));
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find Jobs</h1>
          <p className="text-gray-500 dark:text-gray-400">Explore thousands of opportunities worldwide</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search job title, company, keywords..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <input
            type="text"
            placeholder="Country"
            value={filters.country}
            onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}
            className="md:w-40 px-4 py-2.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={filters.jobType}
            onChange={e => setFilters(f => ({ ...f, jobType: e.target.value, page: 1 }))}
            className="md:w-40 px-4 py-2.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">Search</button>
        </form>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total ? `${pagination.total} jobs found` : ''}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5 animate-pulse h-44" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No jobs found. Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${filters.page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border dark:border-gray-700 hover:border-blue-500'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default JobsPage;
