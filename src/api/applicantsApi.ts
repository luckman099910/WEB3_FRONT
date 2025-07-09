import { api } from './palmPayApi';
 
export const registerApplicant = async (applicant: { username: string; email: string; phonenumber: string; description: string }) => {
  const response = await api.post('/api/applicants', applicant);
  return response.data;
};

export const getApplicants = async () => {
  const response = await api.get('/api/applicants');
  return response.data;
}; 