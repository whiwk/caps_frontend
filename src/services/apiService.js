// src/services/apiService.js
import axios from 'axios';
import { getNewToken, isTokenExpired } from '../utils/tokenService';

const api = axios.create({
  baseURL: 'http://10.30.1.221/api/v1/'
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

export default api;
