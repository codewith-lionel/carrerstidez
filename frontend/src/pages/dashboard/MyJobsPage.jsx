import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Briefcase, Plus, Pencil, Trash2, Users, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const MyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsAPI.getMyJobs()
      .then(res => setJobs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await jobsAPI.deleteJob(id);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Jobs</h2>
          <Link to="/dashboard/post-job" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <Plus size={16} /> Post Job
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-24 animate-pulse" />)}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p>No jobs posted yet.</p>
            <Link to="/dashboard/post-job" className="text-blue-600 mt-2 inline-block">Post your first job →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job._id} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.location?.country} • {job.jobType}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Users size={11} />{job.applicantsCount} applicants</span>
                      <span className="flex items-center gap-1"><Eye size={11} />{job.views} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{job.status}</span>
                    <Link to={`/jobs/${job._id}/applicants`} className="p-2 text-gray-400 hover:text-blue-600 transition"><Users size={16} /></Link>
                    <Link to={`/dashboard/edit-job/${job._id}`} className="p-2 text-gray-400 hover:text-yellow-600 transition"><Pencil size={16} /></Link>
                    <button onClick={() => handleDelete(job._id)} className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyJobsPage;
