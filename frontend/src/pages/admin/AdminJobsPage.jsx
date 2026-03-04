import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { Briefcase, Search, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllJobs({ page, status: statusFilter || undefined, search: search || undefined });
      setJobs(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await adminAPI.toggleJobStatus(id);
      setJobs(prev => prev.map(j => j._id === id ? res.data.data : j));
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update job');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await adminAPI.deleteJob(id);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Jobs Management</h2>

        {/* Filters */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="w-full pl-9 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            Search
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{pagination.total ?? 0} jobs total</p>

        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-16 animate-pulse" />)}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
            <p>No jobs found</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Job</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Recruiter</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Posted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {jobs.map(job => (
                  <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium dark:text-white">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.company?.name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                      {job.recruiter?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        {job.jobType?.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(job._id)}
                          className="text-indigo-600 hover:text-indigo-800 transition"
                          title={job.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {job.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex gap-2 mt-4">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-500'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminJobsPage;
