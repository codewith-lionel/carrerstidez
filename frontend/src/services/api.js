import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefresh } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// Auth
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// Jobs
export const jobsAPI = {
  getJobs: (params) => api.get("/jobs", { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post("/jobs", data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get("/jobs/my-jobs"),
  getJobApplicants: (id) => api.get(`/jobs/${id}/applicants`),
  getRecommended: () => api.get("/jobs/recommended"),
};

// Applications
export const applicationsAPI = {
  apply: (jobId, data) => api.post(`/applications/jobs/${jobId}`, data),
  getMyApplications: () => api.get("/applications/my"),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  withdraw: (id) => api.put(`/applications/${id}/withdraw`),
};

// Universities
export const universitiesAPI = {
  getUniversities: (params) => api.get("/universities", { params }),
  getUniversity: (id) => api.get(`/universities/${id}`),
  createUniversity: (data) => api.post("/universities", data),
  updateUniversity: (id, data) => api.put(`/universities/${id}`, data),
  deleteUniversity: (id) => api.delete(`/universities/${id}`),
};

// Programs
export const programsAPI = {
  getPrograms: (params) => api.get("/programs", { params }),
  getProgram: (id) => api.get(`/programs/${id}`),
  createProgram: (data) => api.post("/programs", data),
  updateProgram: (id, data) => api.put(`/programs/${id}`, data),
  deleteProgram: (id) => api.delete(`/programs/${id}`),
};

// Scholarships
export const scholarshipsAPI = {
  getScholarships: (params) => api.get("/scholarships", { params }),
  getScholarship: (id) => api.get(`/scholarships/${id}`),
  createScholarship: (data) => api.post("/scholarships", data),
  updateScholarship: (id, data) => api.put(`/scholarships/${id}`, data),
  deleteScholarship: (id) => api.delete(`/scholarships/${id}`),
};

// Saved
export const savedAPI = {
  getSavedJobs: () => api.get("/saved/jobs"),
  saveJob: (jobId) => api.post(`/saved/jobs/${jobId}`),
  unsaveJob: (jobId) => api.delete(`/saved/jobs/${jobId}`),
  getSavedPrograms: () => api.get("/saved/programs"),
  saveProgram: (programId) => api.post(`/saved/programs/${programId}`),
  unsaveProgram: (programId) => api.delete(`/saved/programs/${programId}`),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  // Jobs
  getAllJobs: (params) => api.get("/admin/jobs", { params }),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  toggleJobStatus: (id) => api.patch(`/admin/jobs/${id}/toggle-status`),
  // Content
  getAllUniversities: (params) => api.get("/admin/universities", { params }),
  getAllPrograms: (params) => api.get("/admin/programs", { params }),
  getAllScholarships: (params) => api.get("/admin/scholarships", { params }),
};

// AI
export const aiAPI = {
  getCareerAdvice: (data) => api.post("/ai/career-advice", data),
};
