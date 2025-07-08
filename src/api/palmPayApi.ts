// API utility for PalmPay dashboard and merchant payments
import axios from 'axios';

export const api = axios.create({
  baseURL: '', // Use relative URLs for Vite proxy
  headers: {
    'Content-Type': 'application/json',
  },
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

export async function getDashboard(userId: string) {
  const res = await api.get(`/api/dashboard`, { params: { userId } });
  return res.data;
}

export async function getMerchantPayments(merchantId: string) {
  const res = await api.get(`/api/merchant/payments`, { params: { merchantId } });
  return res.data;
} 