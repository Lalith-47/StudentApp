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
    getAll: () => api.get("/roadmap"),
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
    getPending: () => api.get("/faculty/pending"),
    approve: (id, data) => api.post(`/faculty/approve/${id}`, data),
    reject: (id, data) => api.post(`/faculty/reject/${id}`, data),
    getHistory: () => api.get("/faculty/history"),
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
