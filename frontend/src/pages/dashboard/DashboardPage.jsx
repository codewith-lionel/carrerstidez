import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Briefcase, FileText, GraduationCap, TrendingUp, BookOpen, Award, Heart, Sparkles } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  // Redirect admin to dedicated admin panel
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 capitalize">
          {user?.role} Dashboard
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === 'student' ? (
            <>
              <Link to="/study-abroad" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-3"><GraduationCap className="text-green-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 transition">Study Abroad</h3>
                <p className="text-sm text-gray-500 mt-1">Explore universities and programs worldwide</p>
              </Link>
              <Link to="/programs" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center mb-3"><BookOpen className="text-teal-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition">Programs</h3>
                <p className="text-sm text-gray-500 mt-1">Find degree programs that match your goals</p>
              </Link>
              <Link to="/scholarships" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-3"><Award className="text-purple-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition">Scholarships</h3>
                <p className="text-sm text-gray-500 mt-1">Discover funding opportunities worldwide</p>
              </Link>
              <Link to="/dashboard/saved-programs" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center mb-3"><Heart className="text-pink-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 transition">Saved Programs</h3>
                <p className="text-sm text-gray-500 mt-1">Programs you've bookmarked for later</p>
              </Link>
              <Link to="/ai-advisor" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center mb-3"><Sparkles className="text-indigo-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition">AI Advisor</h3>
                <p className="text-sm text-gray-500 mt-1">Get personalized study abroad advice from AI</p>
              </Link>
            </>
          ) : user?.role === 'jobseeker' ? (
            <>
              <Link to="/jobs" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-3"><Briefcase className="text-blue-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition">Browse Jobs</h3>
                <p className="text-sm text-gray-500 mt-1">Find your dream job from thousands of listings</p>
              </Link>
              <Link to="/dashboard/applications" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-3"><FileText className="text-orange-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 transition">My Applications</h3>
                <p className="text-sm text-gray-500 mt-1">Track your job application statuses</p>
              </Link>
              <Link to="/ai-advisor" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center mb-3"><Sparkles className="text-indigo-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition">AI Career Advisor</h3>
                <p className="text-sm text-gray-500 mt-1">Get personalized career advice powered by AI</p>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard/my-jobs" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-3"><Briefcase className="text-blue-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition">My Jobs</h3>
                <p className="text-sm text-gray-500 mt-1">Manage your job postings</p>
              </Link>
              <Link to="/dashboard/post-job" className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-6 hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-3"><TrendingUp className="text-green-600" size={22} /></div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 transition">Post a Job</h3>
                <p className="text-sm text-gray-500 mt-1">Reach thousands of qualified candidates</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
