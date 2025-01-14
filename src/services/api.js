import axios from 'axios';

// Create axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:3000', // You might want to change this for production
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add any default headers needed for React Native
    'User-Agent': 'ReactNative',
  },
  // Add timeout for mobile networks
  timeout: 10000,
});

// Handle network errors specific to mobile
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error') {
      // Handle offline state
      throw new Error('Please check your internet connection');
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await API.post('/login', { email, password });
    return response.data.token;
  } catch (error) {
    // Handle specific mobile error cases
    if (!error.response) {
      throw new Error('Network error occurred');
    }
    throw error;
  }
};

export const fetchUsers = async (token: string) => {
  try {
    const response = await API.get('/users', {
      headers: { 
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Handle token expiration
      throw new Error('Session expired. Please login again.');
    }
    throw error;
  }
};