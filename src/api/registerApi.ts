import { api } from './palmPayApi';

// Registration: no OTP, just username, email, phone, password
export const register = async (username: string, email: string, phone: string, password: string) => {
  const response = await api.post('/api/auth/signup', { username, email, phone, password });
  return response.data;
}; 