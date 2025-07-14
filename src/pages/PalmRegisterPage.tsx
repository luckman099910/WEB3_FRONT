import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HandScan from '../components/HandScan';
import { registerPalmHash } from '../api/palmPayApi';

const PalmRegisterPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [error, setError] = useState('');
  const [showHandScan, setShowHandScan] = useState(true);
  const [scanComplete, setScanComplete] = useState(false);
  const navigate = useNavigate();

  const handleScanSuccess = async (jwt: string) => {
    setStatus('loading');
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) throw new Error('User not found. Please log in.');
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
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
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]" style={{height:"100vh"}}>
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
    </Layout>
  );
};

export default PalmRegisterPage; 