import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { login, loginWithOTP } from '../api/loginApi';
import { sendOTP, resendOTP } from '../api/otpApi';

const LAST_LOGIN_PREFIX = 'last_login_';
const OTP_REQUIRED_PREFIX = 'otp_required_';
const OTP_REQUIRED_EXPIRY_HOURS = 24;
const HOURS_24_MS = 24 * 60 * 60 * 1000;
const ADMIN_EMAIL = 'admin@palmpay.com';

// Utility to clear OTP cooldown for a given email
export function clearOtpCooldown(email: string) {
  localStorage.removeItem(`${OTP_REQUIRED_PREFIX}${email}`);
}

const shouldSkipLoginOTP = (email: string) => {
  const key = `${LAST_LOGIN_PREFIX}${email}`;
  const last = localStorage.getItem(key);
  if (!last) return false;
  const lastTime = parseInt(last, 10);
  if (isNaN(lastTime)) return false;
  return Date.now() - lastTime < HOURS_24_MS;
};

const setLastLogin = (email: string) => {
  localStorage.setItem(`${LAST_LOGIN_PREFIX}${email}`, Date.now().toString());
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpInfoMsg, setOtpInfoMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => setResendCooldown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const getIdentifier = () => loginMethod === 'email' ? email : phone;
  const getOtpRequiredKey = () => `${OTP_REQUIRED_PREFIX}${getIdentifier()}`;

  // Check if OTP is required (every 24 hours)
  const isOtpRequired = () => {
    const key = getOtpRequiredKey();
    const value = localStorage.getItem(key);
    if (!value) return true; // No previous OTP, so it's required
    const lastOtp = parseInt(value, 10);
    if (isNaN(lastOtp)) return true;
    const now = Date.now();
    return now - lastOtp > OTP_REQUIRED_EXPIRY_HOURS * 60 * 60 * 1000;
  };

  const setOtpRequiredFlag = () => {
    const key = getOtpRequiredKey();
    localStorage.setItem(key, Date.now().toString());
  };

  const cleanupOtpFlags = () => {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(OTP_REQUIRED_PREFIX)) {
        const v = localStorage.getItem(k);
        if (v) {
          const lastOtp = parseInt(v, 10);
          if (Date.now() - lastOtp > OTP_REQUIRED_EXPIRY_HOURS * 60 * 60 * 1000) {
            localStorage.removeItem(k);
          }
        }
      }
    });
  };

  React.useEffect(() => {
    cleanupOtpFlags();
  }, []);

  // Main login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpInfoMsg('');
    setLoading(true);

    try {
      if (!showOtpStep) {
        const loginData = loginMethod === 'email' 
          ? { email, password }
          : { phone, password };
        
        // Always allow admin to log in directly (no OTP)
        if (loginMethod === 'email' && email.trim().toLowerCase() === ADMIN_EMAIL) {
          const loginResult = await login({ email, password });
          handleLoginSuccess(loginResult);
          setLastLogin(email);
          return;
        }
        // Always verify password first
        await login(loginData);
        
        // Check if we should skip OTP (login within 24 hours)
        if (loginMethod === 'email' && shouldSkipLoginOTP(email)) {
          // Perform real login and set session
          const loginResult = await login({ email, password });
          handleLoginSuccess(loginResult);
          setLastLogin(email);
          return;
        }
        // Check if OTP is required (every 24 hours)
        if (isOtpRequired()) {
          // Send OTP
          try {
            await sendOTP(email, phone, 'login');
            setOtpInfoMsg('OTP sent! Please check your email.');
            setResendCooldown(60); // Start cooldown after sending OTP
          } catch (err: any) {
            // If OTP already sent, show OTP UI anyway
            if (err.response?.data?.error && err.response.data.error.includes('OTP already sent')) {
              setOtpInfoMsg('OTP already sent. Please check your email or resend code.');
            } else {
              setError(err.response?.data?.error || 'Failed to send OTP');
              setLoading(false);
              return;
            }
          }
          setShowOtpStep(true);
          setError('');
        } else {
          // OTP not required, login directly
          const loginResult = await login(loginData);
          handleLoginSuccess(loginResult);
          if (loginMethod === 'email') setLastLogin(email);
        }
      } else {
        // Step 2: OTP verification
        const loginData = loginMethod === 'email' 
          ? { email, otp }
          : { phone, otp };
        const data = await loginWithOTP(loginData);
        handleLoginSuccess(data);
        setOtpRequiredFlag(); // Mark that OTP was used
        if (loginMethod === 'email') setLastLogin(email); // Store login timestamp
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
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

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setOtpInfoMsg('');
    setLoading(true);
    try {
      await resendOTP(email, phone, 'login');
      setOtpInfoMsg('OTP resent! Please check your email.');
      setResendCooldown(60); // Start cooldown after resending OTP
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setShowOtpStep(false);
    setOtp('');
    setError('');
    setOtpInfoMsg('');
  };

  // OTP Step UI
  if (showOtpStep) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark overflow-hidden">
          <div className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
            <h2 className="text-2xl font-light text-primary mb-6 text-center">Verify OTP</h2>
            {otpInfoMsg && <div className="mb-4 text-green-400 text-center">{otpInfoMsg}</div>}
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            <div className="mb-6 text-center">
              <p className="text-white/70 mb-2">We've sent a verification code to:</p>
              <p className="text-white font-medium">{loginMethod === 'email' ? email : phone}</p>
            </div>
            <div className="mb-4 flex justify-center gap-2">
              {/* 6 digit OTP input boxes */}
              {[0,1,2,3,4,5].map(i => (
                <input
                  key={i}
                  id={`otp-box-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i] || ''}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    // Clear error and info when user types
                    if (error) setError('');
                    if (otpInfoMsg) setOtpInfoMsg('');
                    // Allow editing
                    let newOtp = otp.split('');
                    newOtp[i] = val;
                    setOtp(newOtp.join('').padEnd(6, ''));
                    // Move to next box
                    if (val && i < 5) {
                      const next = document.getElementById(`otp-box-${i+1}`);
                      if (next) (next as HTMLInputElement).focus();
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Backspace') {
                      // Clear error and info when user types
                      if (error) setError('');
                      if (otpInfoMsg) setOtpInfoMsg('');
                      let newOtp = otp.split('');
                      newOtp[i] = '';
                      setOtp(newOtp.join(''));
                      if (!otp[i] && i > 0) {
                        const prev = document.getElementById(`otp-box-${i-1}`);
                        if (prev) (prev as HTMLInputElement).focus();
                      }
                    }
                  }}
                  className="w-12 h-12 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-green/50 transition-all duration-300"
                />
              ))}
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleLogin}
                disabled={loading || otp.length !== 6}
                className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              
              <button 
                onClick={handleResendOTP}
                disabled={loading || resendCooldown > 0}
                className="w-full px-6 py-3 rounded-full btn-secondary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : (loading ? 'Sending...' : 'Resend Code')}
              </button>
              
              <button 
                onClick={handleBackToForm}
                className="w-full px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 font-medium"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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