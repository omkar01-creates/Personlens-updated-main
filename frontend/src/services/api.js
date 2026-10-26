
import axios from "axios";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://personlens-updated000123.onrender.com";

const API = axios.create({
  baseURL: `${BACKEND_URL.replace(/\/+$/, "")}/api`,
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

export default API;
