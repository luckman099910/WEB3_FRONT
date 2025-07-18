import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { login } from '../api/loginApi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginData = loginMethod === 'email' 
        ? { email, password }
        : { phone, password };
      
      const result = await login(loginData);
      handleLoginSuccess(result);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (data: any) => {
    if (data.token && typeof data.token === 'string') {
      localStorage.setItem('session', data.token);
    } else {
      localStorage.removeItem('session');
    }
    if (data.user) {
      const userWithIsAdmin = { ...data.user, is_admin: Boolean(data.user.is_admin) };
      localStorage.setItem('user', JSON.stringify(userWithIsAdmin));
      if (userWithIsAdmin.is_admin === true) {
        navigate('/admin');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      localStorage.removeItem('user');
      navigate('/user-dashboard');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark overflow-hidden">
        <div className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
          <h2 className="text-2xl font-light text-primary mb-6 text-center">Login to PalmPay</h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-full transition-all duration-300 ${
                  loginMethod === 'email' 
                    ? 'bg-neon-green text-dark font-medium' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-full transition-all duration-300 ${
                  loginMethod === 'phone' 
                    ? 'bg-neon-green text-dark font-medium' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Phone
              </button>
            </div>

            {loginMethod === 'email' ? (
              <div>
                <label className="block text-sm text-white/70 mb-2">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" 
                  placeholder="you@email.com" 
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm text-white/70 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" 
                  placeholder="+1234567890" 
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-white/70 mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-white/60 text-sm">
            Don't have an account? <a href="/register" className="text-neon-green hover:underline">Register</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage; 