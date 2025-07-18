import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import emailjs from '@emailjs/browser';
import config from '../config';

// EMAILJS CONFIG - FILL THESE WITH YOUR OWN CREDENTIALS
const EMAILJS_SERVICE_ID = 'service_7t156nd';
const EMAILJS_TEMPLATE_ID = 'template_1i74x7a';
const EMAILJS_PUBLIC_KEY = 'GTbB6CpImqizlrK6Y';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to check if input is email or phone
function isEmail(input: string) {
  return /\S+@\S+\.\S+/.test(input);
}
function isPhone(input: string) {
  return /^\+?[0-9]{7,15}$/.test(input);
}

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'form' | 'check-email' | 'otp' | 'password'>('form');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState(''); // Store generated OTP
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const navigate = useNavigate();
  const [contact, setContact] = useState(''); // email or phone
  const [otpMethod, setOtpMethod] = useState<'email' | 'phone' | null>(null);

  // Check if user came from magic link
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const type = searchParams.get('type');
    
    if (token && email && type === 'registration') {
      setEmail(email);
      setStep('otp');
    }
  }, [searchParams]);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  // Step 1: Enter username and contact (email or phone), send OTP
  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!contact || !username) {
      setError('Email or phone and username are required.');
      return;
    }
    if (!isEmail(contact) && !isPhone(contact)) {
      setError('Please enter a valid email address or phone number.');
      return;
    }
    if (username.length < 2) {
      setError('Username must be at least 2 characters long.');
      return;
    }
    setLoading(true);
    try {
      if (isEmail(contact)) {
        setOtpMethod('email');
        const otpCode = generateOTP();
        setSentOtp(otpCode);
        // Send OTP via EMAILJS
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            email: contact,
            passcode : otpCode,
            time: new Date().toLocaleString(),
          },
          EMAILJS_PUBLIC_KEY
        );
        setInfoMessage('Verification code sent to your email!');
      } else if (isPhone(contact)) {
        setOtpMethod('phone');
        // Send OTP via backend Twilio Verify endpoint
        const response = await fetch(`${config.API_BASE_URL}/api/send-sms-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: contact })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to send SMS');
        setInfoMessage('Verification code sent to your phone!');
      }
      setStep('check-email');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP (on frontend for email, via backend for phone)
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    try {
      if (otpMethod === 'email') {
        if (otp === sentOtp) {
          setStep('password');
        } else {
          setError('Invalid verification code.');
        }
      } else if (otpMethod === 'phone') {
        // Verify OTP via backend
        const response = await fetch(`${config.API_BASE_URL}/api/verify-sms-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: contact, otp })
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setStep('password');
        } else {
          setError(result.message || 'Invalid verification code.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set password and register with backend
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    if (!password || !confirmPassword) {
      setError('Password and confirm password are required.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // Build payload based on contact type
      let payload: any = { username, password };
      if (isEmail(contact)) {
        payload.email = contact;
      } else if (isPhone(contact)) {
        payload.phone = contact;
      }
      // Call backend /signup endpoint
      const response = await fetch(`${config.API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Registration failed');
      if (result.token) {
        localStorage.setItem('session', result.token);
      }
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      setInfoMessage('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep('form');
    setOtp('');
    setError('');
    setInfoMessage('');
  };

  const handleBackToEmail = () => {
    setStep('check-email');
    setError('');
    setInfoMessage('');
  };

  // Step 1: Email and Name Input
  if (step === 'form') {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark overflow-hidden">
          <div className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
            <h2 className="text-2xl font-light text-primary mb-6 text-center">Register for PalmPay</h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            {infoMessage && <div className="mb-4 text-green-400 text-center">{infoMessage}</div>}
            
            <form onSubmit={handleInitiateRegistration} className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" 
                  placeholder="Your Name" 
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/70 mb-2">Email Address or Phone Number</label>
                <input 
                  type="text" 
                  value={contact} 
                  onChange={e => setContact(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light" 
                  placeholder="you@email.com or +1234567890" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !contact || !username} 
                className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Verification...' : 'Send Verification Code'}
              </button>
            </form>

            <div className="mt-6 text-center text-white/60 text-sm">
              Already have an account? <a href="/login" className="text-neon-green hover:underline">Login</a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Step 2: Check Email
  if (step === 'check-email') {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark overflow-hidden">
          <div className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
            <h2 className="text-2xl font-light text-primary mb-6 text-center">Check Your Email</h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            {infoMessage && <div className="mb-4 text-green-400 text-center">{infoMessage}</div>}
            
            <div className="mb-6 text-center">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white/70 mb-2">We've sent a verification code to:</p>
              <p className="text-white font-medium">{contact}</p>
              <p className="text-white/60 text-sm mt-4">
                Look for the 6-digit code in your email or SMS and enter it below, or click the verification link in your email.
              </p>
            </div>

            <button 
              onClick={() => setStep('otp')}
              className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium mb-3"
            >
              Enter Code Manually
            </button>
            
            <button 
              onClick={handleBackToForm}
              className="w-full px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 font-medium"
            >
              Back to Registration
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Step 3: OTP Verification
  if (step === 'otp') {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark overflow-hidden">
          <div className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
            <h2 className="text-2xl font-light text-primary mb-6 text-center">Enter Verification Code</h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            {infoMessage && <div className="mb-4 text-green-400 text-center">{infoMessage}</div>}
            
            <div className="mb-6 text-center">
              <p className="text-white/70 mb-2">Enter the 6-digit code from your email or SMS:</p>
              <p className="text-white font-medium">{contact}</p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="mb-4 flex justify-center gap-2">
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
                      if (error) setError('');
                      if (infoMessage) setInfoMessage('');
                      let newOtp = otp.split('');
                      newOtp[i] = val;
                      setOtp(newOtp.join('').padEnd(6, ''));
                      if (val && i < 5) {
                        const next = document.getElementById(`otp-box-${i+1}`);
                        if (next) (next as HTMLInputElement).focus();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace') {
                        if (error) setError('');
                        if (infoMessage) setInfoMessage('');
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

              <button 
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              
              <button 
                type="button"
                onClick={handleBackToEmail}
                className="w-full px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 font-medium"
              >
                Back to Email
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  // Step 4: Set Password
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark overflow-hidden">
        <div className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl">
          <h2 className="text-2xl font-light text-primary mb-6 text-center">Set Your Password</h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          {infoMessage && <div className="mb-4 text-green-400 text-center">{infoMessage}</div>}
          
          <div className="mb-6 text-center">
            <p className="text-white/70 mb-2">Complete your registration for:</p>
            <p className="text-white font-medium">{contact}</p>
          </div>
          
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
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
            
            <div>
              <label className="block text-sm text-white/70 mb-2">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage; 