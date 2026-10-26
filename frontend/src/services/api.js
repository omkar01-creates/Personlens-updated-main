
import axios from "axios";

const BACKEND_URL =
  "https://personlens-updated000123.onrender.com";

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API request failed:",
      error.response?.status,
      error.config?.url,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default API;
