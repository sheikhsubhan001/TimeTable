import axios from 'axios';

// Determine backend URL based on environment
const getBackendURL = () => {
  if (import.meta.env.DEV) {
    return 'https://time-table-server-three.vercel.app/api';
  }
  // For production, use environment variable or the deployed backend URL
  return import.meta.env.VITE_BACKEND_URL || 'https://time-table-server-three.vercel.app/api';
};

const API = axios.create({
  baseURL: getBackendURL(),
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('umt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('umt_token');
      localStorage.removeItem('umt_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──
export const register = (data) => API.post('/auth/register', data);
export const login    = (data) => API.post('/auth/login', data);
export const getMe    = ()     => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ── Courses ──
export const getCourses    = (params) => API.get('/courses', { params });
export const getCourse     = (id)     => API.get(`/courses/${id}`);
export const addCourse     = (data)   => API.post('/courses', data);
export const updateCourse  = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse  = (id)     => API.delete(`/courses/${id}`);

export default API;
