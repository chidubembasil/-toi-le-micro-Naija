import axios from "axios";
import { NewsItem, NewsCreateDTO, NewsUpdateDTO } from "@/types/news";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),

  verify2FA: (otpId: string, otp: string) =>
    apiClient.post("/auth/verify-2fa", { otpId, otp }),

  logout: () => apiClient.post("/auth/logout"),

  getMe: () => apiClient.get("/auth/me"),
};

// News API
export const newsAPI = {
  getAll: () => apiClient.get<NewsItem[]>("/news"),

  getBySlug: (slug: string) => apiClient.get<NewsItem>(`/news/${slug}`),

  create: (data: NewsCreateDTO) => apiClient.post("/news", data),

  update: (id: number, data: NewsUpdateDTO) => apiClient.put(`/news/${id}`, data),

  delete: (id: number) => apiClient.delete(`/news/${id}`),

  publish: (id: number) => apiClient.post(`/news/${id}/publish`),
};

export default apiClient;
