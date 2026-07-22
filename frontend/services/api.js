import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  // This sends JSON in the BODY, not the URL
  login: (username, password) => api.post("/auth/login", { username, password }),
  register: (username, email, password) => api.post("/auth/register", { username, email, password }),
};

export const chatAPI = {
  // This also sends JSON in the BODY
  sendMessage: (message, session_id) => api.post("/chat/send", { message, session_id }),
  getHistory: (user_id) => api.get(`/chat/history/${user_id}`),
  getSession: (session_id) => api.get(`/chat/session/${session_id}`),
  deleteSession: (session_id) => api.delete(`/chat/session/${session_id}`),
  clearAllHistory: (user_id) => api.delete(`/chat/history/${user_id}`),
  emailSummary: (session_id) => api.post(`/chat/email-summary?session_id=${session_id}`),
  getAnalytics: () => api.get("/chat/analytics"),
  uploadKb: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/chat/admin/upload-kb", formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        // We explicitly set 'X-CSRFToken' which matches what /auth/login sends
        "X-CSRFToken": localStorage.getItem("csrfToken") 
      },
    });
  },
};
export default api;