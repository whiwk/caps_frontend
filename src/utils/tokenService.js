import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import apiConfig from '../config/apiConfig';

export const getNewToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${apiConfig.baseURL}api/v1/token/refresh/`, {
      refresh: refreshToken
    });

    const { access, refresh } = response.data;
    localStorage.setItem('authToken', access);
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);  // Update the refresh token if a new one is returned
    }
    return access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token || typeof token !== 'string') {
    console.error('Invalid token specified: must be a string');
    return true;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;  // Convert to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};
