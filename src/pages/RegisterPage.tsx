import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { register } from '../api/registerApi';

const LAST_REGISTRATION_PREFIX = 'last_registration_';
const HOURS_24_MS = 24 * 60 * 60 * 1000;

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePhone = (phone: string) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    return phoneRegex.test(phone);
  };

  const shouldSkipOTP = (email: string) => {
    const key = `${LAST_REGISTRATION_PREFIX}${email}`;
    const last = localStorage.getItem(key);
    if (!last) return false;
    const lastTime = parseInt(last, 10);
    if (isNaN(lastTime)) return false;
    return Date.now() - lastTime < HOURS_24_MS;
  };

  const setLastRegistration = (email: string) => {
    localStorage.setItem(`${LAST_REGISTRATION_PREFIX}${email}`, Date.now().toString());
  };

  const handleRegister = async () => {
    setError('');
    if (!username || !email || !password) {
      setError('Username, email, and password are required.');
      return;
    }
    if (phone && !validatePhone(phone)) {
      setError('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }
    setLoading(true);
    try {
      await register(username, email, phone, password);
      setLastRegistration(email);
      navigate('/user-dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center pt-20" style={{ height: "100vh" }}>
        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
          <h2 className="text-2xl font-light text-primary mb-6 text-center">Register for PalmPay</h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="Your Name" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="you@email.com" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Phone Number (Optional)</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="+1234567890" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium">Register Plampay</button>
          <div className="mt-4 text-center text-white/60 text-sm">
            Already have an account? <a href="/login" className="text-neon-green hover:underline">Login</a>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default RegisterPage; 