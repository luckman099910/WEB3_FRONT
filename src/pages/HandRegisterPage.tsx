import React, { useState } from 'react';
import HandScan from '../components/HandScan';
import { registerPalmHash } from '../api/palmPayApi';

const HandRegisterPage = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleScanSuccess = async (jwt: string) => {
    setStatus('loading');
    setError('');
    setSuccessMsg('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) throw new Error('User not found. Please log in.');
      const res = await registerPalmHash(user.id, jwt);
      setStatus('success');
      setSuccessMsg('Palm registered successfully!');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#10131c] flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl mx-auto">
        {status === 'success' && (
          <div className="mb-4 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 text-center">{successMsg}</div>
        )}
        {status === 'error' && (
          <div className="mb-4 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-center">{error}</div>
        )}
        <HandScan onSuccess={handleScanSuccess} />
      </div>
    </div>
  );
};

export default HandRegisterPage; 