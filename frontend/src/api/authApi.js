import apiClient from './axios';

export const register = (data) => apiClient.post('/auth/register', data).then((res) => res.data);

export const login = (data) => apiClient.post('/auth/login', data).then((res) => res.data);

export const getCurrentUser = () => apiClient.get('/auth/me').then((res) => res.data);
export const updateCurrentUser = (data) => apiClient.put('/auth/me', data).then((res) => res.data);
export const getAdminStats = () => apiClient.get('/admin/stats').then((res) => res.data);
