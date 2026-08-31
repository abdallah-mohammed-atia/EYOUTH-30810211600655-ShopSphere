import axios from 'axios';

const defaultBaseUrl = process.env.NODE_ENV === 'test'
  ? 'http://localhost:5000/api'
  : (process.env.REACT_APP_API_URL || '/api');

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || defaultBaseUrl,
});

// Attach the JWT (if present) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize 401 handling.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
