import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance for client-side requests
const clientApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token from session
clientApi.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const session = await getSession();
        if (session?.refreshToken) {
          // You might want to implement token refresh logic here
          // For now, we'll redirect to login
          window.location.href = '/login';
        }
      } catch (refreshError) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => clientApi.post('/auth/register/', userData),
  login: (credentials) => clientApi.post('/auth/login/', credentials),
  logout: (refreshToken) => clientApi.post('/auth/logout/', { refresh_token: refreshToken }),
  me: () => clientApi.get('/auth/me/'),
  updateProfile: (userData) => clientApi.patch('/auth/profile/update/', userData),
  getStats: () => clientApi.get('/auth/stats/'),
};

// Websites API
export const websitesAPI = {
  getAll: (params) => clientApi.get('/websites/', { params }),
  getById: (id) => clientApi.get(`/websites/${id}/`),
  getMyWebsites: () => clientApi.get('/websites/my/'),
  create: (websiteData) => clientApi.post('/websites/', websiteData),
  update: (id, websiteData) => clientApi.put(`/websites/${id}/`, websiteData),
  delete: (id) => clientApi.delete(`/websites/${id}/`),
  getStats: (id) => clientApi.get(`/websites/${id}/stats/`),
  getPages: (websiteId) => clientApi.get(`/websites/${websiteId}/pages/`),
  createPage: (pageData) => clientApi.post('/websites/pages/', pageData),
  updatePage: (id, pageData) => clientApi.put(`/websites/pages/${id}/`, pageData),
  deletePage: (id) => clientApi.delete(`/websites/pages/${id}/`),
};

// Backlinks API
export const backlinksAPI = {
  getAll: (params) => clientApi.get('/backlinks/', { params }),
  getById: (id) => clientApi.get(`/backlinks/${id}/`),
  search: (params) => clientApi.get('/backlinks/search/', { params }),
  getMyBacklinks: () => clientApi.get('/backlinks/my/'),
  getPurchasedBacklinks: () => clientApi.get('/backlinks/purchased/'),
  create: (backlinkData) => clientApi.post('/backlinks/', backlinkData),
  update: (id, backlinkData) => clientApi.put(`/backlinks/${id}/`, backlinkData),
  delete: (id) => clientApi.delete(`/backlinks/${id}/`),
  purchase: (id, purchaseData) => clientApi.patch(`/backlinks/${id}/purchase/`, purchaseData),
  review: (id, reviewData) => clientApi.patch(`/backlinks/${id}/review/`, reviewData),
  getOrders: () => clientApi.get('/backlinks/orders/'),
  getOrderById: (id) => clientApi.get(`/backlinks/orders/${id}/`),
  getStats: () => clientApi.get('/backlinks/stats/'),
};

export default clientApi; 