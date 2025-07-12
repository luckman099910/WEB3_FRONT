import { api } from './palmPayApi';

export const login = async (credentials: { email?: string; phone?: string; password: string }) => {
  const response = await api.post('/api/auth/login', credentials);
  console.log(response);
  
  return response.data;
};

export const loginWithOTP = async (credentials: { email?: string; phone?: string; otp: string }) => {
  const response = await api.post('/api/auth/login-otp', credentials);
  console.log(response);
  
  return response.data;
}; 