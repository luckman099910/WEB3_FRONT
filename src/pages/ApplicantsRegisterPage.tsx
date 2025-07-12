import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { registerApplicant } from '../api/applicantsApi';

const ApplicantsRegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone: string) => /^\+?[0-9]{7,15}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username || !email || !phonenumber || !description) {
      setError('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(phonenumber)) {
      setError('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      await registerApplicant({ username, email, phonenumber, description });
      setSuccess('Successfully joined the waitlist!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]" style={{height:"100vh"}}>
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
          <h2 className="text-2xl font-light text-primary mb-6 text-center">Join the PalmPay Waitlist</h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Name</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="Your Name" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="you@email.com" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Phone Number</label>
            <input type="tel" value={phonenumber} onChange={e => setPhonenumber(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="+1234567890" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="Tell us why you're interested..." />
          </div>
          <button type="submit" className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium" disabled={loading}>{loading ? 'Submitting...' : 'Join Waitlist'}</button>
        </form>
      </div>
    </Layout>
  );
};

export default ApplicantsRegisterPage; 