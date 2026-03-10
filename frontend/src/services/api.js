import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ AUTH API CALLS
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// PRODUCT API
export const productAPI = {
  getAllProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  updateProductStock: (id, inStock) => api.patch(`/products/${id}/stock`, { inStock }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// CATEGORY API
export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
};

// CART API
export const cartAPI = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  addToCart: (userId, productId, quantity = 1) => api.post(`/cart/${userId}/add`, { productId, quantity }),
  updateCartItem: (userId, itemId, quantity) => api.put(`/cart/${userId}/item/${itemId}`, { quantity }),
  removeFromCart: (userId, itemId) => api.delete(`/cart/${userId}/item/${itemId}`),
  clearCart: (userId) => api.delete(`/cart/${userId}/clear`),
};

// ORDER API
export const orderAPI = {
  createOrder: (userId, address, paymentType) => api.post('/orders', { userId, address, paymentType }),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  updateOrderStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status }),
  cancelOrder: (orderId) => api.patch(`/orders/${orderId}/cancel`),
  getAllOrders: () => api.get('/orders'),
};

export default api;