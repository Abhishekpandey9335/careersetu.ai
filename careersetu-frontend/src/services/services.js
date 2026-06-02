import api from './api';

// ═══════════════════════════════════════════════════════════════
// EXAMS  — GET /exams
// ═══════════════════════════════════════════════════════════════
export const examService = {
  /** GET /exams?category=SSC&status=ACTIVE&search=cgl&page=0&size=20 */
  search: (params = {}) => api.get('/exams', { params }),

  /** GET /exams/{slug} */
  getBySlug: (slug) => api.get(`/exams/${slug}`),

  /** GET /exams/upcoming?days=30 */
  getUpcoming: (days = 30) => api.get('/exams/upcoming', { params: { days } }),

  /** GET /exams/calendar?year=2024&month=6 */
  getCalendar: (year, month) => api.get('/exams/calendar', { params: { year, month } }),

  /** POST /exams/eligibility-check */
  checkEligibility: (payload) => api.post('/exams/eligibility-check', payload),
};

// ═══════════════════════════════════════════════════════════════
// JOBS  — GET /jobs
// ═══════════════════════════════════════════════════════════════
export const jobService = {
  /**
   * GET /jobs?type=FULL_TIME|INTERNSHIP&location=&salaryMin=&search=&page=&size=
   */
  search: (params = {}) => api.get('/jobs', { params }),

  /** GET /jobs/{id} */
  getById: (id) => api.get(`/jobs/${id}`),
};

// ═══════════════════════════════════════════════════════════════
// COMPANIES  — GET /companies
// ═══════════════════════════════════════════════════════════════
export const companyService = {
  /** GET /companies?industry=&search=&page=&size= */
  search: (params = {}) => api.get('/companies', { params }),

  /** GET /companies/{slug} — optional auth for readiness score */
  getBySlug: (slug) => api.get(`/companies/${slug}`),
};

// ═══════════════════════════════════════════════════════════════
// ROADMAPS  — GET /roadmaps
// ═══════════════════════════════════════════════════════════════
export const roadmapService = {
  getPopular: () => api.get('/roadmaps'),
  getBySlug: (slug) => api.get(`/roadmaps/${slug}`),
  getByExam: (examId) => api.get(`/roadmaps/exam/${examId}`),
};

// ═══════════════════════════════════════════════════════════════
// STUDY MATERIALS  — GET /study-materials
// ═══════════════════════════════════════════════════════════════
export const studyMaterialService = {
  /** GET /study-materials?examId=&type=NOTES&premium=false&page=&size= */
  filter: (params = {}) => api.get('/study-materials', { params }),

  /** GET /study-materials/{id} */
  getById: (id) => api.get(`/study-materials/${id}`),
};

// ═══════════════════════════════════════════════════════════════
// HOMEPAGE  — GET /home
// ═══════════════════════════════════════════════════════════════
export const homepageService = {
  getData: () => api.get('/home'),
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD  — requires auth
// ═══════════════════════════════════════════════════════════════
export const dashboardService = {
  /** GET /dashboard — full snapshot */
  get: () => api.get('/dashboard'),

  /** GET /dashboard/stats — quick stat cards */
  getStats: () => api.get('/dashboard/stats'),
};

// ═══════════════════════════════════════════════════════════════
// APPLICATION TRACKER  — requires auth
// ═══════════════════════════════════════════════════════════════
export const applicationService = {
  getAll: () => api.get('/applications'),
  create: (payload) => api.post('/applications', payload),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  delete: (id) => api.delete(`/applications/${id}`),
};

// ═══════════════════════════════════════════════════════════════
// BOOKMARKS  — requires auth
// ═══════════════════════════════════════════════════════════════
export const bookmarkService = {
  getByType: (type) => api.get('/bookmarks', { params: { type } }),
  toggle: (payload) => api.post('/bookmarks/toggle', payload),
};

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS  — requires auth
// ═══════════════════════════════════════════════════════════════
export const notificationService = {
  get: (page = 0, size = 10) => api.get('/notifications', { params: { page, size } }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// ═══════════════════════════════════════════════════════════════
// USER PROFILE  — requires auth
// ═══════════════════════════════════════════════════════════════
export const userService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (payload) => api.put('/users/me', payload),
};

// ═══════════════════════════════════════════════════════════════
// AI ADVISOR  — requires auth
// ═══════════════════════════════════════════════════════════════
export const aiService = {
  chat: (payload) => api.post('/ai/chat', payload),
  generateRoadmap: (payload) => api.post('/ai/roadmap', payload),
  skillGap: (targetRole) => api.get('/ai/skill-gap', { params: { targetRole } }),
  careerGuidance: () => api.get('/ai/career-guidance'),
  predictSalary: (payload) => api.post('/ai/salary-predictor', payload),
  collegePredictor: (payload) => api.post('/ai/college-predictor', payload),
  interviewCoach: (payload) => api.post('/ai/interview-coach', payload),
  careerGps: (targetSalary, targetYears = 2) =>
    api.get('/ai/career-gps', { params: { targetSalary, targetYears } }),
  getConversations: () => api.get('/ai/conversations'),
  deleteConversation: (id) => api.delete(`/ai/conversations/${id}`),
};

// ═══════════════════════════════════════════════════════════════
// SUBSCRIPTIONS / RAZORPAY  — requires auth
// ═══════════════════════════════════════════════════════════════
export const subscriptionService = {
  /** POST /subscriptions/order  body: { plan: 'MONTHLY'|'YEARLY' } */
  createOrder: (plan) => api.post('/subscriptions/order', { plan }),

  /**
   * POST /subscriptions/verify
   * body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
   */
  verifyPayment: (payload) => api.post('/subscriptions/verify', payload),

  getHistory: () => api.get('/subscriptions/history'),
};
