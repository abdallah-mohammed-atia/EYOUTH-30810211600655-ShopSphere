import React, { createContext, useContext, useState, useCallback } from 'react';
import * as cartApi from '../api/cartApi';
import * as orderApi from '../api/orderApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart();
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError('Unable to load your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addItem = async (productId, quantity = 1) => {
    setError(null);
    try {
      await cartApi.addToCart(productId, quantity);
      await refreshCart();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Could not add item to cart.';
      setError(message);
      return { success: false, message };
    }
  };

  const updateItem = async (id, quantity) => {
    setError(null);
    try {
      await cartApi.updateCartItem(id, quantity);
      await refreshCart();
    } catch (err) {
      setError('Could not update item quantity.');
    }
  };

  const removeItem = async (id) => {
    setError(null);
    try {
      await cartApi.removeCartItem(id);
      await refreshCart();
    } catch (err) {
      setError('Could not remove item from cart.');
    }
  };
  const clearCart = async () => {
    setError(null);
    try {
      await Promise.all(items.map((item) => cartApi.removeCartItem(item.id)));
      await refreshCart();
    } catch (err) {
      setError('Could not clear the cart.');
    }
  };

  const placeOrder = async () => {
    setError(null);
    try {
      const data = await orderApi.createOrder();
      await refreshCart();
      return { success: true, order: data.order };
    } catch (err) {
      const message = err.response?.data?.message || 'Could not complete the order.';
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    items,
    total,
    loading,
    error,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    refreshCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    placeOrder,
  };


  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
