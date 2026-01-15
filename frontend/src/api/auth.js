import axios from 'axios';

const API_BASE_URL = 'https://cpbackend.saksin.online/api';
// const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - no longer need to add token manually since it's in cookies
api.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent with withCredentials: true
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401/403 and not already retrying
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token is sent automatically via cookie
        const response = await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          processQueue(null);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Redirect to login on refresh failure
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
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

export const uploadCoverImage = async (formData) => {
  const response = await api.post('/profile/upload-cover', formData, {
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

// Quest/Problem APIs
export const getQuestStats = async () => {
  const response = await api.get('/quests/stats');
  return response.data;
};

export const getQuests = async (params = {}) => {
  const response = await api.get('/quests', { params });
  return response.data;
};

export const getHeatmapData = async (year) => {
  const response = await api.get('/quests/heatmap', { params: { year } });
  return response.data;
};

export const getAllTopics = async () => {
  const response = await api.get('/quests/topics');
  return response.data;
};

// Logout API - clears cookies on server
export const logoutUser = async () => {
  const response = await api.post('/users/logout');
  return response.data;
};

export default api;
