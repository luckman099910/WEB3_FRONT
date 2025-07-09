import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { login } from '../api/loginApi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      if (data.session && typeof data.session === 'string') {
        localStorage.setItem('session', data.session);
      } else if (data.token && typeof data.token === 'string') {
        localStorage.setItem('session', data.token);
      } else {
        localStorage.removeItem('session');
      }
      if (data.user) {
        // Ensure is_admin is present and boolean
        const userWithIsAdmin = { ...data.user, is_admin: Boolean(data.user.is_admin) };
        localStorage.setItem('user', JSON.stringify(userWithIsAdmin));
        // Redirect based on admin status
        if (userWithIsAdmin.is_admin === true) {
          navigate('/admin');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        localStorage.removeItem('user');
        navigate('/user-dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark overflow-hidden">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
        <h2 className="text-2xl font-light text-primary mb-6 text-center">Login to PalmPay</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm text-white/70 mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="you@email.com" />
        </div>
        <div className="mb-6">
          <label className="block text-sm text-white/70 mb-2">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium">Login</button>
        <div className="mt-4 text-center text-white/60 text-sm">
          Don&apos;t have an account? <a href="/register" className="text-neon-green hover:underline">Register</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 