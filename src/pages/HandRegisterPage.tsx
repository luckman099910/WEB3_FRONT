import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HandScan from '../components/HandScan';
import { registerPalmHash } from '../api/palmPayApi';

const HandRegisterPage = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showHandScan, setShowHandScan] = useState(true);
  const [scanComplete, setScanComplete] = useState(false);
  const navigate = useNavigate();

  const handleScanSuccess = async (jwt: string) => {
    setStatus('loading');
    setError('');
    setSuccessMsg('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) throw new Error('User not found. Please log in.');
      await registerPalmHash(user.id, jwt);
      setStatus('success');
      setScanComplete(true);
      setShowHandScan(false);
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Registration failed.');
      setShowHandScan(false);
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setError('');
    setScanComplete(false);
    setShowHandScan(true);
  };

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full bg-[#10131c] flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl mx-auto">
        {status === 'success' && (
          <div className="mb-4 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 text-center">
            <p>Palm registered successfully!</p>
            <button
              onClick={handleReturn}
              className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-black font-medium hover:shadow-lg transition-all duration-300"
            >
              Return
            </button>
          </div>
        )}
        {status === 'error' && (
          <div className="mb-4 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-center">
            {error}
            <button
              onClick={handleRetry}
              className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-black font-medium hover:shadow-lg transition-all duration-300"
            >
              Re-register
            </button>
          </div>
        )}
        {showHandScan && <HandScan onSuccess={handleScanSuccess} onCancel={handleReturn} />}
      </div>
    </div>
  );
};

export default HandRegisterPage; 