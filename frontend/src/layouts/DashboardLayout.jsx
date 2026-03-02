import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Briefcase, GraduationCap, BookOpen, Heart,
  FileText, Settings, LogOut, ChevronRight, Award, Users,
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;

  const jobseekerNav = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/applications', label: 'My Applications', icon: FileText },
    { to: '/dashboard/saved-jobs', label: 'Saved Jobs', icon: Heart },
    { to: '/dashboard/saved-programs', label: 'Saved Programs', icon: BookOpen },
    { to: '/dashboard/resume', label: 'Resume Builder', icon: FileText },
  ];

  const recruiterNav = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/my-jobs', label: 'My Jobs', icon: Briefcase },
    { to: '/dashboard/post-job', label: 'Post Job', icon: ChevronRight },
  ];

  const adminNav = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/users', label: 'Users', icon: Users },
    { to: '/dashboard/all-jobs', label: 'All Jobs', icon: Briefcase },
    { to: '/dashboard/universities', label: 'Universities', icon: GraduationCap },
    { to: '/dashboard/programs', label: 'Programs', icon: BookOpen },
    { to: '/dashboard/scholarships', label: 'Scholarships', icon: Award },
  ];

  const getNavItems = () => {
    if (user?.role === 'recruiter') return recruiterNav;
    if (user?.role === 'admin') return adminNav;
    return jobseekerNav;
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b dark:border-gray-800">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-blue-600">CAREERS</span>
            <span className="text-xl font-bold text-gray-800 dark:text-white">TIDEZ</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {getNavItems().map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/dashboard'} className={navClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t dark:border-gray-800 space-y-1">
          <NavLink to="/profile" className={navClass}>
            <Settings size={18} /> Settings
          </NavLink>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
