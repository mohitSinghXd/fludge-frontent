import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://fludge-backend.vercel.app/';

const client = axios.create({
  baseURL: `https://fludge-backend.vercel.app/api`,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('lf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lf_token');
      localStorage.removeItem('lf_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE}${imagePath}`;
};

export default client;
