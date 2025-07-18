import { api } from './palmPayApi';

// Legacy registration function (keeping for backward compatibility)
export const register = async (username: string, email: string, phone: string, password: string) => {
  const response = await api.post('/api/auth/signup', { username, email, phone, password });
  return response.data;
};

// New Supabase magic link registration functions
export const initiateRegistration = async (email: string, username: string) => {
  const response = await api.post('/api/auth/initiate-registration', { email, username });
  return response.data;
};

export const verifyRegistrationOTP = async (email: string, token: string) => {
  const response = await api.post('/api/auth/verify-registration-otp', { email, token });
  return response.data;
};

export const verifyRegistrationOTPCode = async (email: string, otp: string) => {
  const response = await api.post('/api/auth/verify-registration-otp-code', { email, otp });
  return response.data;
};

export const completeRegistrationWithOTP = async (email: string, password: string) => {
  const response = await api.post('/api/auth/complete-registration-otp', { email, password });
  return response.data;
}; 