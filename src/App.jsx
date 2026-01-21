import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/LandingPage';
import SurveyDetail from './components/business/SurveyDetail';
import Profile from './pages/Profile';
import CreateSurvey from './components/business/CreateSurvey';
import MySurveys from './components/business/MySurveys';
import SurveyResponses from './components/business/SurveyResponses';
import SurveyAnalytics from './components/business/SurveyAnalytics';
import CompanyProfile from './components/business/CompanyProfile';
import UserProfile from './components/user/UserProfile';
import CompanyOnboarding from './components/business/CompanyOnboarding';
import AdminProfile from './components/admin/AdminProfile';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboards
import UserDashboard from './components/dashboards/UserDashboard';
import BusinessDashboard from './components/dashboards/BusinessDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';

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

          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserProfile />
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
            path="/business/survey/:surveyId/responses"
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <SurveyResponses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/survey/:surveyId/analytics"
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <SurveyAnalytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/profile"
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <CompanyProfile />
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
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfile />
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
