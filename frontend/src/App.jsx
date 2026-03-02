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
import AdminUsersPage from './pages/admin/AdminUsersPage';

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

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard/applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
            <Route path="/dashboard/my-jobs" element={<ProtectedRoute roles={['recruiter', 'admin']}><MyJobsPage /></ProtectedRoute>} />
            <Route path="/dashboard/post-job" element={<ProtectedRoute roles={['recruiter', 'admin']}><PostJobPage /></ProtectedRoute>} />
            <Route path="/dashboard/saved-jobs" element={<ProtectedRoute><SavedJobsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/dashboard/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
