import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JobsPage from './pages/jobs/JobsPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import StudyAbroadPage from './pages/study/StudyAbroadPage';
import ProgramsPage from './pages/study/ProgramsPage';
import ScholarshipsPage from './pages/study/ScholarshipsPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MyApplicationsPage from './pages/dashboard/MyApplicationsPage';
import MyJobsPage from './pages/dashboard/MyJobsPage';
import PostJobPage from './pages/dashboard/PostJobPage';
import SavedJobsPage from './pages/dashboard/SavedJobsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import AIAdvisorPage from './pages/ai/AIAdvisorPage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import AdminUniversitiesPage from './pages/admin/AdminUniversitiesPage';
import AdminProgramsPage from './pages/admin/AdminProgramsPage';
import AdminScholarshipsPage from './pages/admin/AdminScholarshipsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/study-abroad" element={<StudyAbroadPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/ai-advisor" element={<ProtectedRoute><AIAdvisorPage /></ProtectedRoute>} />

            {/* User dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard/applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
            <Route path="/dashboard/my-jobs" element={<ProtectedRoute roles={['recruiter', 'admin']}><MyJobsPage /></ProtectedRoute>} />
            <Route path="/dashboard/post-job" element={<ProtectedRoute roles={['recruiter', 'admin']}><PostJobPage /></ProtectedRoute>} />
            <Route path="/dashboard/saved-jobs" element={<ProtectedRoute><SavedJobsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Admin panel routes */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute roles={['admin']}><AdminJobsPage /></ProtectedRoute>} />
            <Route path="/admin/universities" element={<ProtectedRoute roles={['admin']}><AdminUniversitiesPage /></ProtectedRoute>} />
            <Route path="/admin/programs" element={<ProtectedRoute roles={['admin']}><AdminProgramsPage /></ProtectedRoute>} />
            <Route path="/admin/scholarships" element={<ProtectedRoute roles={['admin']}><AdminScholarshipsPage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
