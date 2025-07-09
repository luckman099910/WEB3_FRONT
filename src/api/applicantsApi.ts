import { api } from './palmPayApi';
 
export const registerApplicant = async (applicant: { username: string; email: string; phonenumber: string; description: string }) => {
  const response = await api.post('/api/applicants', applicant);
  return response.data;
}; 