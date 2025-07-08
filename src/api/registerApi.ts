import { api } from './palmPayApi';

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/api/auth/signup', { username, email, password });
  return response.data;
}; 