import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // For client-side requests, we'll get the token from the session
    if (typeof window !== 'undefined') {
      // This will be handled by the individual API calls using getSession()
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken }),
  me: () => api.get('/auth/me/'),
  updateProfile: (userData) => api.patch('/auth/profile/update/', userData),
  getStats: () => api.get('/auth/stats/'),
};

// Websites API
export const websitesAPI = {
  getAll: (params) => api.get('/websites/', { params }),
  getById: (id) => api.get(`/websites/${id}/`),
  getMyWebsites: () => api.get('/websites/my/'),
  create: (websiteData) => api.post('/websites/', websiteData),
  update: (id, websiteData) => api.put(`/websites/${id}/`, websiteData),
  delete: (id) => api.delete(`/websites/${id}/`),
  getStats: (id) => api.get(`/websites/${id}/stats/`),
  getPages: (websiteId) => api.get(`/websites/${websiteId}/pages/`),
  createPage: (pageData) => api.post('/websites/pages/', pageData),
  updatePage: (id, pageData) => api.put(`/websites/pages/${id}/`, pageData),
  deletePage: (id) => api.delete(`/websites/pages/${id}/`),
};

// Backlinks API
export const backlinksAPI = {
  getAll: (params) => api.get('/backlinks/', { params }),
  getById: (id) => api.get(`/backlinks/${id}/`),
  search: (params) => api.get('/backlinks/search/', { params }),
  getMyBacklinks: () => api.get('/backlinks/my/'),
  getPurchasedBacklinks: () => api.get('/backlinks/purchased/'),
  create: (backlinkData) => api.post('/backlinks/', backlinkData),
  update: (id, backlinkData) => api.put(`/backlinks/${id}/`, backlinkData),
  delete: (id) => api.delete(`/backlinks/${id}/`),
  purchase: (id, purchaseData) => api.patch(`/backlinks/${id}/purchase/`, purchaseData),
  review: (id, reviewData) => api.patch(`/backlinks/${id}/review/`, reviewData),
  getOrders: () => api.get('/backlinks/orders/'),
  getOrderById: (id) => api.get(`/backlinks/orders/${id}/`),
  getStats: () => api.get('/backlinks/stats/'),
};

export default api; 