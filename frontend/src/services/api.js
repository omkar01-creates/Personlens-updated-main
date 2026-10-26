
import axios from "axios";

// Render backend URL
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://personlens-updated000123.onrender.com";

// Create Axios instance
const API = axios.create({
  baseURL: `${BACKEND_URL.replace(/\/+$/, "")}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests
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

// Handle API response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("API connection error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
