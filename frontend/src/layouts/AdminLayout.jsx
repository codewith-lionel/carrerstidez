import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Briefcase, GraduationCap, BookOpen, Award,
  Users, LogOut, Settings, Shield,
} from 'lucide-react';

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/universities', label: 'Universities', icon: GraduationCap },
  { to: '/admin/programs', label: 'Programs', icon: BookOpen },
  { to: '/admin/scholarships', label: 'Scholarships', icon: Award },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col">
        {/* Brand */}
        <div className="p-4 border-b dark:border-gray-800">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-indigo-600">ADMIN</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white"> PANEL</span>
            </div>
          </Link>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium dark:text-white">{user?.name}</p>
              <p className="text-xs text-indigo-500 font-medium">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/admin'} className={navClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t dark:border-gray-800 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition">
            <Settings size={18} /> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Shield size={15} className="text-indigo-600" />
            <span className="font-medium text-indigo-600">Admin Panel</span>
            <span>— CAREERSTIDEZ</span>
          </div>
        </div>
        <main className="p-6 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
