import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8082/api",
});

// Request Interceptor: Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 errors globally
api.interceptors.response.use(
  (response) => response, // If request is successful, do nothing
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // Force page reload to clear state and redirect to login
      window.location.href = "/login";

      alert("Session expired. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default api;
