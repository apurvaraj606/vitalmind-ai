import axios from 'axios';

// Base API instance — automatically attaches JWT token to every request
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;