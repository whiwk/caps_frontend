// src/utils/tokenService.js
import  { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const getNewToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post('http://10.30.1.221/api/v1/token/refresh/', {
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
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;  // Convert to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};
