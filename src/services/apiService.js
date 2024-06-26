import axios from 'axios';
import { getNewToken, isTokenExpired } from '../utils/tokenService';

const api = axios.create({
  baseURL: 'http://backend:8000/api/v1/'
});

api.interceptors.request.use(
  async (config) => {
    let authToken = localStorage.getItem('authToken');
    if (isTokenExpired(authToken)) {
      authToken = await getNewToken();
    }
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 307) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth/login'; // Use window.location.href for redirection
    }
    return Promise.reject(error);
  }
);

export default api;
