import { api } from './palmPayApi';

export const sendOTP = async (email?: string, phone?: string, type: string = 'registration') => {
  const response = await api.post('/api/otp/send', { email, phone, type });
  return response.data;
};

export const verifyOTP = async (email?: string, phone?: string, otp: string, type: string = 'registration') => {
  const response = await api.post('/api/otp/verify', { email, phone, otp, type });
  return response.data;
};

export const resendOTP = async (email?: string, phone?: string, type: string = 'registration') => {
  const response = await api.post('/api/otp/resend', { email, phone, type });
  return response.data;
}; 