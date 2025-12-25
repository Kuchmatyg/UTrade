import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5056',
  withCredentials: false,
});

// Attach Authorization header from localStorage.token for all requests
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore (localStorage might be unavailable in some environments)
  }
  return config;
});

// Optional: on 401 remove token
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      try { localStorage.removeItem('token'); } catch {};
    }
    return Promise.reject(err);
  }
);

export default api;
