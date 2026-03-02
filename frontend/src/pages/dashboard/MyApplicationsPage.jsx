import { useState, useEffect } from 'react';
import { applicationsAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FileText, MapPin, Briefcase, Calendar } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-green-100 text-green-700',
  interviewed: 'bg-purple-100 text-purple-700',
  offered: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-100 text-gray-500',
};

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationsAPI.getMyApplications()
      .then(res => setApplications(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Applications</h2>
        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-24 animate-pulse" />)}</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p>No applications yet. <a href="/jobs" className="text-blue-600">Browse jobs</a></p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app._id} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{app.job?.title}</h3>
                    <p className="text-sm text-gray-500">{app.job?.company?.name}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><MapPin size={11} />{app.job?.location?.country}</span>
                      <span className="flex items-center gap-1"><Briefcase size={11} />{app.job?.jobType}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} />Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[app.status] || 'bg-gray-100 text-gray-500'}`}>
                    {app.status}
                  </span>
                </div>
                {app.interviewDate && (
                  <div className="mt-2 text-sm text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg inline-block">
                    📅 Interview: {new Date(app.interviewDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplicationsPage;
