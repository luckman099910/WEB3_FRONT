// API utility for admin management
import { api } from './palmPayApi';

export async function assignBalance(userId: string, amount: number) {
  const res = await api.post('/api/assignBalance', { userId, amount });
  return res.data;
}

export async function getUsers() {
  const res = await api.get('/api/auth/users'); // Adjust endpoint as needed
  return res.data;
} 