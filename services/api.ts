import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: 'http://192.168.29.144:4000/api', // Use your local IP
});

const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('token');
  } else {
    try {
      return await SecureStore.getItemAsync('token');
    } catch (error) {
      console.error('Error fetching token from SecureStore:', error);
      return null;
    }
  }
};

const storeToken = async (token: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem('token', token);
  } else {
    await SecureStore.setItemAsync('token', token);
  }
};

const removeToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem('token');
  } else {
    await SecureStore.deleteItemAsync('token');
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    await storeToken(response.data.token);
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/users', { name, email, password });
    await storeToken(response.data.token);
    return response.data;
  },
  logout: async () => {
    await removeToken();
  },
};

export const products = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (formData: FormData) => 
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { name?: string; email?: string; avatar?: string }) =>
    api.put('/users/profile', data),

  // ⭐ Favorites Functions
  getFavorites: () => api.get('/favorites'), // ✅ Fetch favorite items
  toggleFavorite: (productId: string) => api.post(`/favorites/${productId}`),
  removeFromFavorites: (productId: string) => api.delete(`/favorites/${productId}`),

  // 🛒 Cart Functions
  getCart: async () => {
    const response = await api.get('/cart', { params: { timestamp: new Date().getTime() } }); // 🚀 Prevent cache issues
    return response;
  },
  addToCart: (productId: string, quantity: number = 1) => 
    api.post('/cart', { productId, quantity }),
  updateCartItem: (itemId: string, quantity: number) =>
    api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId: string) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};
