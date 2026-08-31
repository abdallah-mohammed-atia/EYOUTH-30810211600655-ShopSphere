import apiClient from './axios';

export const createOrder = () => apiClient.post('/orders').then((res) => res.data);
export const getOrders = () => apiClient.get('/orders').then((res) => res.data);
