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
  let token = '';
  const session = localStorage.getItem('session');
  if (session) {
    try {
      // If session is a JWT string
      if (session.startsWith('eyJ')) {
        token = session.replace(/['"]+/g, '');
      } else {
        // If session is an object with a token property
        const parsed = JSON.parse(session);
        token = parsed.token || '';
      }
    } catch {
      token = '';
    }
  }
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
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