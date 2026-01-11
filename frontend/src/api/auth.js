import axios from 'axios';

const API_BASE_URL = 'https://cpbackend.saksin.online/api';
// const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      // Token expired, clear storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const googleLogin = async (credential) => {
  const response = await api.post('/users/google-login', { credential });
  return response.data;
};

// Profile APIs
export const getProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/profile/update', data);
  return response.data;
};

export const uploadProfileImage = async (formData) => {
  const response = await api.post('/profile/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUserByUsername = async (username) => {
  const response = await api.get(`/profile/user/${username}`);
  return response.data;
};

export default api;
