import apiClient from './axios';

export const getCategories = () => apiClient.get('/categories').then((res) => res.data);
