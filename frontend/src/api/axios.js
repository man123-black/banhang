import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (err.response?.data?.message) {
      // Don't toast for some endpoints
      if (!err.config?.url?.includes('/analytics/track')) {
        toast.error(err.response.data.message);
      }
    }
    return Promise.reject(err);
  }
);

export default API;
