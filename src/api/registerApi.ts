import { api } from './palmPayApi';

export const register = async (username: string, email: string, phone: string, password: string, otp: string) => {
  const response = await api.post('/api/auth/signup', { username, email, phone, password, otp });
  return response.data;
}; 