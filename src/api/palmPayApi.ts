// API utility for PalmPay dashboard and merchant payments
import axios from 'axios';
// @ts-ignore
import config from '../config';

export const api = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: false,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token.replace(/['"]+/g, '')}`;
  }
  return config;
});

// Example API methods (update as needed)
export const getDashboard = (userId: string) =>
  api.get(`/api/dashboard`, { params: { userId } });

export const getMerchantPayments = (merchantId: string) =>
  api.get(`/api/merchant/payments`, { params: { merchantId } });

export const registerPalmHash = async (userId: string, handinfo: string) => {
  return api.post('/api/registerPalm', { userId, handinfo });
};

export const verifyPalmHash = async (userId: string, handinfo: string) => {
  return api.post('/api/verifyPalm', { userId, handinfo });
};

// Add other API methods as needed, using the centralized 'api' instance 

// Utility for safe JSON parsing
export function safeJsonParse(value: string | null, fallback: any = null) {
  try {
    if (!value || value === 'undefined' || value === 'null') return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
} 