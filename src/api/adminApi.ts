// API utility for admin management
import { api } from './palmPayApi';

export const assignBalance = (userId: string, amount: number) =>
  api.post('/api/assignBalance', { userId, amount });

export const getUsers = () =>
  api.get('/api/auth/users'); 