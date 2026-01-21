import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email, password, displayName, role) =>
    api.post('/auth/register', { email, password, displayName, role }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  verifyToken: (token) =>
    api.post('/auth/verify-token', { token }),
};

export const surveysService = {
  createSurvey: (data) =>
    api.post('/surveys', data),
  
  getActiveSurveys: () =>
    api.get('/surveys/active'),
  
  getSurveysByCompany: (companyId) =>
    api.get(`/surveys/company/${companyId}`),
  
  getSurveyById: (id) =>
    api.get(`/surveys/${id}`),
  
  updateSurvey: (id, data) =>
    api.put(`/surveys/${id}`, data),
  
  toggleSurveyActive: (id) =>
    api.put(`/surveys/${id}/toggle`),
  
  suggestQuestions: (surveyId, goal) =>
    api.post(`/surveys/${surveyId}/suggest-questions`, { goal }),
};

export const submissionsService = {
  submitSurvey: (surveyId, answers) =>
    api.post('/submissions', { surveyId, answers }),
  
  getSubmissionsByUser: (userId) =>
    api.get(`/submissions/user/${userId}`),
  
  getSubmissionsBySurvey: (surveyId) =>
    api.get(`/submissions/survey/${surveyId}`),
};

export const analyticsService = {
  getUserDashboard: () =>
    api.get('/analytics/dashboard/user'),
  
  getCompanyDashboard: (companyId) =>
    api.get(`/analytics/dashboard/company/${companyId}`),
  
  getSurveyQualityTrend: (surveyId) =>
    api.get(`/analytics/survey/${surveyId}/quality-trend`),
  
  getSurveyBreakdown: (surveyId) =>
    api.get(`/analytics/survey/${surveyId}/breakdown`),
};

export const companiesService = {
  createCompany: (data) =>
    api.post('/companies', data),
  
  getCompanyById: (id) =>
    api.get(`/companies/${id}`),
  
  getCompanyByUserId: (userId) =>
    api.get(`/companies/user/${userId}`),
  
  updateCompany: (id, data) =>
    api.put(`/companies/${id}`, data),
  
  getAllCompanies: () =>
    api.get('/companies'),
};

export const adminService = {
  getGlobalMetrics: () =>
    api.get('/admin/metrics'),
  
  getAllUsers: () =>
    api.get('/admin/users'),
  
  getAllCompanies: () =>
    api.get('/admin/companies'),
  
  getPendingCompanies: () =>
    api.get('/admin/companies/pending'),
  
  updateUserStatus: (uid, status) =>
    api.put(`/admin/users/${uid}/status`, { status }),
  
  updateCompanyStatus: (id, status) =>
    api.put(`/admin/companies/${id}/status`, { status }),
};

export default api;
