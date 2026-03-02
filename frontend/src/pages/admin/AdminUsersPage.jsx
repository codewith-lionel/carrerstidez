import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Users, CheckCircle, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    adminAPI.getUsers({ role: roleFilter || undefined })
      .then(res => setUsers(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roleFilter]);

  const handleToggle = async (id) => {
    try {
      const res = await adminAPI.toggleUserStatus(id);
      setUsers(prev => prev.map(u => u._id === id ? res.data.data : u));
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update user');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Users Management</h2>
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none">
            <option value="">All Roles</option>
            <option value="jobseeker">Job Seeker</option>
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-14 animate-pulse" />)}</div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">User</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Role</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Joined</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">{u.name?.charAt(0)}</div>
                        <div>
                          <p className="font-medium dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="capitalize text-gray-600 dark:text-gray-400">{u.role}</span></td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-medium ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {u.isActive ? <><CheckCircle size={13} /> Active</> : <><XCircle size={13} /> Inactive</>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(u._id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
