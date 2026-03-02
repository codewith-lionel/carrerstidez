import { useState, useEffect } from 'react';
import { savedAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Briefcase, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savedAPI.getSavedJobs()
      .then(res => setSavedJobs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await savedAPI.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(s => s.job._id !== jobId));
      toast.success('Removed from saved');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Saved Jobs</h2>
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-24 animate-pulse" />)}</div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Heart size={48} className="mx-auto mb-4 opacity-30" />
            <p>No saved jobs. <Link to="/jobs" className="text-blue-600">Browse jobs</Link></p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedJobs.map(({ job }) => (
              <div key={job._id} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-4 flex items-start justify-between gap-4">
                <div>
                  <Link to={`/jobs/${job._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition">{job.title}</Link>
                  <p className="text-sm text-gray-500">{job.company?.name}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={11} />{job.location?.country}</span>
                    <span className="flex items-center gap-1"><Briefcase size={11} />{job.jobType}</span>
                  </div>
                </div>
                <button onClick={() => handleUnsave(job._id)} className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedJobsPage;
