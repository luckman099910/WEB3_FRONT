import { api } from './palmPayApi';

export const login = (email: string, password: string) =>
  api.post('/api/auth/login', { email, password }); 