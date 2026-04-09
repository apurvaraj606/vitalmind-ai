import axios from 'axios';

// Base API instance — automatically attaches JWT token to every request
const api = axios.create({
  baseURL: 'https://vitalmind-ai-e9xn.onrender.com/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;