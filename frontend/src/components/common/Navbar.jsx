import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Menu, X, Briefcase, GraduationCap, User, LogOut, LayoutDashboard, Sparkles, Shield } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  const navLinkClass = ({ isActive }) =>
    `font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'}`;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">CAREERS</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">TIDEZ</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/jobs" className={navLinkClass}>
              <span className="flex items-center gap-1"><Briefcase size={16} /> Jobs</span>
            </NavLink>
            <NavLink to="/study-abroad" className={navLinkClass}>
              <span className="flex items-center gap-1"><GraduationCap size={16} /> Study Abroad</span>
            </NavLink>
            <NavLink to="/scholarships" className={navLinkClass}>Scholarships</NavLink>
            {isAuthenticated && (
              <NavLink to="/ai-advisor" className={navLinkClass}>
                <span className="flex items-center gap-1"><Sparkles size={16} /> AI Advisor</span>
              </NavLink>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2 text-sm font-medium"
                >
                  <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold ${user?.role === 'admin' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="dark:text-white">{user?.name?.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-1 z-50">
                    {user?.role === 'admin' ? (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 text-indigo-600" onClick={() => setDropdownOpen(false)}>
                        <Shield size={16} /> Admin Panel
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    )}
                    <Link to="/ai-advisor" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200" onClick={() => setDropdownOpen(false)}>
                      <Sparkles size={16} /> AI Advisor
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200" onClick={() => setDropdownOpen(false)}>
                      <User size={16} /> Profile
                    </Link>
                    <hr className="my-1 dark:border-gray-700" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 transition">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <NavLink to="/jobs" className="block py-2 text-gray-600 dark:text-gray-300">Jobs</NavLink>
            <NavLink to="/study-abroad" className="block py-2 text-gray-600 dark:text-gray-300">Study Abroad</NavLink>
            <NavLink to="/scholarships" className="block py-2 text-gray-600 dark:text-gray-300">Scholarships</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/ai-advisor" className="block py-2 text-gray-600 dark:text-gray-300">AI Advisor</NavLink>
                <NavLink to={dashboardPath} className="block py-2 text-gray-600 dark:text-gray-300">
                  {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </NavLink>
                <button onClick={handleLogout} className="block py-2 text-red-600">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="block py-2 text-gray-600 dark:text-gray-300">Login</NavLink>
                <NavLink to="/register" className="block py-2 text-blue-600 font-medium">Register</NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

