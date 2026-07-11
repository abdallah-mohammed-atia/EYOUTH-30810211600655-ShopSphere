import apiClient from './axios';

export const getCart = () => apiClient.get('/cart').then((res) => res.data);

export const addToCart = (productId, quantity = 1) =>
  apiClient.post('/cart', { productId, quantity }).then((res) => res.data);

export const updateCartItem = (id, quantity) =>
  apiClient.put(`/cart/${id}`, { quantity }).then((res) => res.data);

export const removeCartItem = (id) => apiClient.delete(`/cart/${id}`).then((res) => res.data);
