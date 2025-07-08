import { api } from './palmPayApi';

export const register = (username: string, email: string, password: string) =>
  api.post('/api/auth/signup', { username, email, password }); 