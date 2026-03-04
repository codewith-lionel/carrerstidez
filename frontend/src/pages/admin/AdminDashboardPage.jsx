import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, FileText, GraduationCap, BookOpen, Award } from 'lucide-react';

const COLORS = ['#4f46e5', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value?.toLocaleString?.() ?? value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Platform overview and analytics</p>

        {stats ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard icon={Users} label="Total Users" value={stats.stats.totalUsers} color="bg-indigo-600" />
              <StatCard icon={Briefcase} label="Total Jobs" value={stats.stats.totalJobs} color="bg-green-600" />
              <StatCard icon={FileText} label="Applications" value={stats.stats.totalApplications} color="bg-orange-500" />
              <StatCard icon={GraduationCap} label="Universities" value={stats.stats.totalUniversities} color="bg-purple-600" />
              <StatCard icon={BookOpen} label="Programs" value={stats.stats.totalPrograms} color="bg-teal-600" />
              <StatCard icon={Award} label="Scholarships" value={stats.stats.totalScholarships} color="bg-pink-600" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Users by Role</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={stats.charts.usersByRole.map(u => ({ name: u._id, value: u.count }))}
                      cx="50%" cy="50%" outerRadius={80} dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {stats.charts.usersByRole.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Applications by Status</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.charts.applicationsByStatus.map(a => ({ name: a._id, count: a.count }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {stats.recent.recentUsers.map(u => (
                    <div key={u._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium dark:text-white">{u.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{u.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Jobs</h3>
                <div className="space-y-3">
                  {stats.recent.recentJobs.map(j => (
                    <div key={j._id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium dark:text-white">{j.title}</p>
                        <p className="text-xs text-gray-500">{j.company?.name}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${j.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {j.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">Failed to load dashboard stats.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
