import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const initializePayment = async (data) => {
  const response = await api.post('/payment/initialize', data);
  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await api.get(`/payment/verify/${reference}`);
  return response.data;
};

export default api;
