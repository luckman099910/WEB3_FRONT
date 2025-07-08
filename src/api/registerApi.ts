import { api } from './palmPayApi';

export async function register(username: string, email: string, password: string) {
  const res = await api.post('/api/auth/signup', { username, email, password });
  // Store JWT token
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
} 