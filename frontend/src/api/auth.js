import axios from 'axios';

// const API_BASE_URL = 'https://cpbackend.saksin.online/api';
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const googleLogin = async (credential) => {
  const response = await api.post('/users/google-login', { credential });
  return response.data;
};

export default api;
