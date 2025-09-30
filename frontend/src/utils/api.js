import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API Service object
const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post("/auth/login", credentials),
    register: (userData) => api.post("/auth/register", userData),
    logout: () => api.post("/auth/logout"),
    getProfile: () => api.get("/auth/profile"),
    updateProfile: (data) => api.put("/auth/profile", data),
  },

  // Direct auth methods for compatibility
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),

  // User analytics
  getUserAnalytics: () => api.get("/analytics/user"),
  updateUserAnalytics: (data) => api.put("/analytics/user", data),
  resetUserAnalytics: () => api.post("/analytics/user/reset"),

  // Quiz endpoints
  quiz: {
    getQuestions: (type = "detailed") =>
      api.get(`/quiz/questions?type=${type}`),
    submitQuiz: (answers) => api.post("/quiz/submit", answers),
    getResults: (id) => api.get(`/quiz/results/${id}`),
    getHistory: () => api.get("/quiz/history"),
  },

  // Roadmap endpoints
  roadmap: {
    getAll: (params = {}) => api.get("/roadmap", { params }),
    getById: (id) => api.get(`/roadmap/${id}`),
    search: (query) => api.get(`/roadmap/search?q=${query}`),
    getByCategory: (category) => api.get(`/roadmap/category/${category}`),
  },

  // College endpoints
  colleges: {
    getAll: (params = {}) => api.get("/colleges", { params }),
    getById: (id) => api.get(`/colleges/${id}`),
    search: (query) => api.get(`/colleges/search?q=${query}`),
    getByLocation: (location) => api.get(`/colleges/location/${location}`),
    getByCourse: (course) => api.get(`/colleges/course/${course}`),
  },

  // Story endpoints
  stories: {
    getAll: (params = {}) => api.get("/stories", { params }),
    getById: (id) => api.get(`/stories/${id}`),
    getFeatured: () => api.get("/stories/featured"),
    getByCategory: (category) => api.get(`/stories/category/${category}`),
    create: (data) => api.post("/stories", data),
    update: (id, data) => api.put(`/stories/${id}`, data),
    delete: (id) => api.delete(`/stories/${id}`),
  },

  // FAQ endpoints
  faq: {
    getAll: (params = {}) => api.get("/faq", { params }),
    getByCategory: (category) => api.get(`/faq/category/${category}`),
    search: (query) => api.get(`/faq/search?q=${query}`),
    create: (data) => api.post("/faq", data),
    update: (id, data) => api.put(`/faq/${id}`, data),
    delete: (id) => api.delete(`/faq/${id}`),
    submitQuery: (queryData) => api.post("/faq/query", queryData),
    getAIProviders: () => api.get("/faq/ai-providers"),
  },

  // Analytics endpoints
  analytics: {
    getDashboard: () => api.get("/analytics/dashboard"),
    getReports: (params = {}) => api.get("/analytics/reports", { params }),
    generateReport: (data) => api.post("/analytics/reports", data),
    getNAACReport: () => api.get("/analytics/naac"),
    getAICTEReport: () => api.get("/analytics/aicte"),
    getNIRFReport: () => api.get("/analytics/nirf"),
  },

  // Activity endpoints
  activities: {
    getAll: (params = {}) => api.get("/activities", { params }),
    getById: (id) => api.get(`/activities/${id}`),
    create: (data) => api.post("/activities", data),
    update: (id, data) => api.put(`/activities/${id}`, data),
    delete: (id) => api.delete(`/activities/${id}`),
    uploadAttachment: (id, file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post(`/activities/${id}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },

  // Faculty endpoints
  faculty: {
    getDashboard: () => api.get("/faculty/dashboard"),
    getPending: (params) => api.get("/faculty/pending", { params }),
    getApproval: (approvalId) => api.get(`/faculty/approval/${approvalId}`),
    approve: (id, data) => api.post(`/faculty/approve/${id}`, data),
    reject: (id, data) => api.post(`/faculty/reject/${id}`, data),
    requestChanges: (id, data) =>
      api.post(`/faculty/request-changes/${id}`, data),
    getApproved: (params) => api.get("/faculty/approved", { params }),
    getRejected: (params) => api.get("/faculty/rejected", { params }),
    getWorkload: (params) => api.get("/faculty/workload", { params }),
    getPerformance: (params) => api.get("/faculty/performance", { params }),
    assignApproval: (id, data) => api.post(`/faculty/assign/${id}`, data),
    exportReport: (type, format, params) =>
      api.get(`/faculty/export/${type}`, {
        params: { format, ...params },
        responseType: "blob",
      }),
    getDepartmentStats: (params) =>
      api.get("/faculty/department-stats", { params }),
    generateComplianceReport: (params) =>
      api.post("/faculty/compliance-report", params),
    getHistory: () => api.get("/faculty/history"),

    // Enhanced Faculty endpoints
    getEnhancedDashboard: () => api.get("/faculty-enhanced/dashboard"),
    getCourses: (params) => api.get("/faculty-enhanced/courses", { params }),
    createCourse: (data) => api.post("/faculty-enhanced/courses", data),
    updateCourse: (courseId, data) =>
      api.put(`/faculty-enhanced/courses/${courseId}`, data),
    uploadSyllabus: (courseId, file) => {
      const formData = new FormData();
      formData.append("syllabus", file);
      return api.post(
        `/faculty-enhanced/courses/${courseId}/syllabus`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    createAssignment: (data) => api.post("/faculty-enhanced/assignments", data),
    getCourseAssignments: (courseId) =>
      api.get(`/faculty-enhanced/courses/${courseId}/assignments`),
    gradeAssignment: (assignmentId, submissionId, data) =>
      api.put(
        `/faculty-enhanced/assignments/${assignmentId}/submissions/${submissionId}/grade`,
        data
      ),
    uploadGrades: (assignmentId, file) => {
      const formData = new FormData();
      formData.append("grades", file);
      return api.post(
        `/faculty-enhanced/assignments/${assignmentId}/bulk-grade`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    createAttendanceSession: (data) =>
      api.post("/faculty-enhanced/attendance", data),
    markAttendance: (attendanceId, data) =>
      api.put(`/faculty-enhanced/attendance/${attendanceId}/mark`, data),
    getAttendanceAnalytics: (courseId, params) =>
      api.get(`/faculty-enhanced/courses/${courseId}/attendance/analytics`, {
        params,
      }),
    generateAttendanceReport: (courseId, params) =>
      api.get(`/faculty-enhanced/courses/${courseId}/attendance/report`, {
        params,
        responseType: "blob",
      }),
    getStudentAnalytics: (courseId) =>
      api.get(`/faculty-enhanced/courses/${courseId}/analytics`),
    createAnnouncement: (data) =>
      api.post("/faculty-enhanced/announcements", data),
    getAnnouncements: (params) =>
      api.get("/faculty-enhanced/announcements", { params }),
    sendBulkMessage: (data) =>
      api.post("/faculty-enhanced/announcements/bulk", data),
    uploadContent: (data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "files") {
          data.files.forEach((file) => formData.append("files", file));
        } else {
          formData.append(key, data[key]);
        }
      });
      return api.post("/faculty-enhanced/content", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    getFacultyContent: (params) =>
      api.get("/faculty-enhanced/content", { params }),
    updateContent: (contentId, data) =>
      api.put(`/faculty-enhanced/content/${contentId}`, data),
    generateShareableLink: (contentId) =>
      api.post(`/faculty-enhanced/content/${contentId}/share`),
    getContentAnalytics: (params) =>
      api.get("/faculty-enhanced/content/analytics", { params }),
  },

  // Enhanced Student endpoints
  studentEnhanced: {
    getDashboard: () => api.get("/student-enhanced/dashboard"),
    getCourses: (params) => api.get("/student-enhanced/courses", { params }),
    getCourseDetails: (courseId) =>
      api.get(`/student-enhanced/courses/${courseId}`),
    submitAssignment: (assignmentId, data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "attachments") {
          data.attachments.forEach((file) =>
            formData.append("attachments", file)
          );
        } else if (key === "answers") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      return api.post(
        `/student-enhanced/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    getAssignmentSubmissions: (params) =>
      api.get("/student-enhanced/assignments/submissions", { params }),
    startStudySession: (data) =>
      api.post("/student-enhanced/study/sessions", data),
    endStudySession: (sessionId, data) =>
      api.put(`/student-enhanced/study/sessions/${sessionId}`, data),
    getPerformanceAnalytics: (params) =>
      api.get("/student-enhanced/analytics/performance", { params }),
    generateReportCard: (params) =>
      api.get("/student-enhanced/analytics/report-card", {
        params,
        responseType: "blob",
      }),
  },

  // Enhanced Admin endpoints
  adminEnhanced: {
    // Dashboard & Analytics
    getDashboard: () => api.get("/admin-enhanced/dashboard"),

    // User Management
    getUsers: (params) => api.get("/admin-enhanced/users", { params }),
    createUser: (userData) => api.post("/admin-enhanced/users", userData),
    updateUser: (userId, userData) =>
      api.put(`/admin-enhanced/users/${userId}`, userData),
    updateUserStatus: (userId, status) =>
      api.patch(`/admin-enhanced/users/${userId}/status`, status),
    resetUserPassword: (userId, passwordData) =>
      api.post(`/admin-enhanced/users/${userId}/reset-password`, passwordData),
    deleteUser: (userId, adminPassword) =>
      api.delete(`/admin-enhanced/users/${userId}`, {
        data: { adminPassword },
      }),

    // New Admin User Management (Faculty/Admin only)
    createFacultyOrAdmin: (userData) =>
      api.post("/auth/admin/create-user", userData),
    getFacultyAndAdminUsers: (params) =>
      api.get("/auth/admin/users", { params }),
    updateFacultyOrAdminUser: (userId, userData) =>
      api.put(`/auth/admin/users/${userId}`, userData),
    deleteFacultyOrAdminUser: (userId) =>
      api.delete(`/auth/admin/users/${userId}`),

    // Course Management
    getCourses: (params) => api.get("/admin-enhanced/courses", { params }),
    updateCourseStatus: (courseId, status) =>
      api.patch(`/admin-enhanced/courses/${courseId}/status`, status),
    assignFacultyToCourse: (courseId, facultyId) =>
      api.post(`/admin-enhanced/courses/${courseId}/assign-faculty`, facultyId),

    // System Announcements
    createSystemAnnouncement: (announcementData) =>
      api.post("/admin-enhanced/announcements", announcementData),
    getSystemAnnouncements: (params) =>
      api.get("/admin-enhanced/announcements", { params }),

    // System Settings
    getSystemSettings: () => api.get("/admin-enhanced/settings"),
    updateSystemSettings: (settings, adminPassword) =>
      api.put("/admin-enhanced/settings", { settings, adminPassword }),
  },

  // Portfolio endpoints
  portfolio: {
    get: () => api.get("/portfolio"),
    create: (data) => api.post("/portfolio", data),
    update: (data) => api.put("/portfolio", data),
    generatePDF: () => api.get("/portfolio/pdf", { responseType: "blob" }),
    generateShareLink: () => api.post("/portfolio/share"),
    getByShareId: (id) => api.get(`/portfolio/share/${id}`),
  },

  // Dashboard endpoints
  dashboard: {
    getStudent: () => api.get("/dashboard/student"),
    getFaculty: () => api.get("/dashboard/faculty"),
    getAdmin: () => api.get("/dashboard/admin"),
  },

  // Admin endpoints
  admin: {
    getDashboard: () => api.get("/admin/dashboard"),
    getUsers: (params) => api.get("/admin/users", { params }),
    createUser: (userData) => api.post("/admin/users", userData),
    updateUserStatus: (userId, data) =>
      api.patch(`/admin/users/${userId}/status`, data),
    resetUserPassword: (userId, data) =>
      api.patch(`/admin/users/${userId}/password`, data),
    deleteUser: (userId, data) =>
      api.delete(`/admin/users/${userId}`, { data }),
    getQuizData: (forceRefresh) =>
      api.get("/admin/quiz-data", {
        params: forceRefresh ? { refresh: true } : {},
      }),
    getAuditLogs: (params = {}) => api.get("/admin/audit-logs", { params }),
  },

  // File upload
  upload: {
    image: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    document: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/upload/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },

  // Health check
  health: () => api.get("/health"),
};

// Helper functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return data.message || "Bad request. Please check your input.";
      case 401:
        return "Unauthorized. Please login again.";
      case 403:
        return "Forbidden. You don't have permission to perform this action.";
      case 404:
        return "Resource not found.";
      case 422:
        return data.message || "Validation error. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Internal server error. Please try again later.";
      default:
        return data.message || "An error occurred. Please try again.";
    }
  } else if (error.request) {
    // Network error
    return "Network error. Please check your connection.";
  } else {
    // Other error
    return error.message || "An unexpected error occurred.";
  }
};

// Export the API service
export default apiService;
export { api };
