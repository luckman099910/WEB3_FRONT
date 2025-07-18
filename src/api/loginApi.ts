import { api } from './palmPayApi';

export const login = async (credentials: { email?: string; phone?: string; password: string }) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
}; 