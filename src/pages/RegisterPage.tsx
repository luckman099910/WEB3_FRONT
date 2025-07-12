import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { register } from '../api/registerApi';
import { sendOTP, verifyOTP, resendOTP } from '../api/otpApi';

const LAST_REGISTRATION_PREFIX = 'last_registration_';
const OTP_REQUIRED_PREFIX = 'otp_required_';
const HOURS_24_MS = 24 * 60 * 60 * 1000;

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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

  const handleSendOTP = async () => {
    setError('');
    
    if (!email) {
      setError('Email is required to send OTP');
      return;
    }
    
    // Validate phone number if provided
    if (phone && !validatePhone(phone)) {
      setError('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }
    
    // Check if we should skip OTP (re-registration within 24 hours)
    if (shouldSkipOTP(email)) {
      // Directly register without OTP
      setLoading(true);
      try {
        await handleRegister(true); // true = skip OTP
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await sendOTP(email, phone, 'registration');
      setOtpSent(true);
      setShowOtpStep(true);
      setError('');
      setResendCooldown(60); // Start cooldown after sending OTP
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      await resendOTP(email, phone, 'registration');
      setError('');
      setResendCooldown(60); // Start cooldown after resending OTP
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    if (!otp) {
      setError('Please enter the OTP code');
      return;
    }
    
    setLoading(true);
    try {
      await verifyOTP(email, phone, otp, 'registration');
      // OTP verified, proceed with registration
      await handleRegister();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (skipOtp = false) => {
    setError('');
    try {
      // On successful registration, clear any OTP cooldown for this email
      localStorage.removeItem(`${OTP_REQUIRED_PREFIX}${email}`);
      // Store registration timestamp
      setLastRegistration(email);
      const data = await register(
        username,
        email,
        phone,
        password,
        skipOtp ? '000000' : otp // Pass dummy OTP if skipping
      );
      if (data.session) {
        localStorage.setItem('session', JSON.stringify(data.session));
      } else {
        localStorage.removeItem('session');
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        localStorage.removeItem('user');
      }
      navigate('/user-dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBackToForm = () => {
    setShowOtpStep(false);
    setOtp('');
    setOtpSent(false);
    setError('');
  };

  if (showOtpStep) {
    return (
      <Layout>
        <div className="flex justify-center items-center pt-20">
          <div className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
            <h2 className="text-2xl font-light text-primary mb-6 text-center">Verify OTP</h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            
            <div className="mb-6 text-center">
              <p className="text-white/70 mb-2">We've sent a verification code to:</p>
              <p className="text-white font-medium">{email}</p>
              {phone && <p className="text-white/60 text-sm">and {phone}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-2">Enter OTP Code</label>
              <input 
                type="text" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                maxLength={6}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light text-center text-2xl tracking-widest" 
                placeholder="000000" 
              />
            </div>

            <button 
              onClick={handleVerifyOTP}
              disabled={loading || !otp}
              className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <button 
              onClick={handleResendOTP}
              disabled={loading || resendCooldown > 0}
              className="w-full px-6 py-3 rounded-full btn-secondary font-medium"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : (loading ? 'Sending...' : 'Resend OTP')}
            </button>
            
            <button 
              onClick={handleBackToForm}
              className="w-full px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 font-medium"
            >
              Back to Form
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center items-center pt-20" style={{height:"100vh"}}>
        <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }} className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
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
          <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium">
            {loading ? 'Sending OTP...' : 'Send OTP & Register'}
          </button>
          <div className="mt-4 text-center text-white/60 text-sm">
            Already have an account? <a href="/login" className="text-neon-green hover:underline">Login</a>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default RegisterPage; 