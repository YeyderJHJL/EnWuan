import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import SurveyDetail from './pages/SurveyDetail';
import Profile from './pages/Profile';
import CreateSurvey from './pages/CreateSurvey';
import MySurveys from './pages/MySurveys';
import CompanyOnboarding from './pages/CompanyOnboarding';
import AdminUsers from './pages/AdminUsers';
import AdminCompanies from './pages/AdminCompanies';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - User */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/surveys"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/survey/:surveyId"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <SurveyDetail />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Business */}
          <Route
            path="/dashboard/business"
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/surveys"
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <MySurveys />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/create-survey"
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <CreateSurvey />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding/company"
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <CompanyOnboarding />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCompanies />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - All authenticated users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
