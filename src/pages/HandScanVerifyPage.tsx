import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HandScan from '../components/HandScan';
import axios from 'axios';

const HandScanVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expecting: { action: 'send' | 'receive', amount, receiverEmail }
  const { action, amount, receiverEmail } = location.state || {};
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(false);
  const [showHandScan, setShowHandScan] = useState(true);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScanSuccess = async (handData: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setStatusMsg('');
    try {
      const session = localStorage.getItem('session');
      let token = '';
      if (session) {
        if (session.startsWith('eyJ')) {
          token = session.replace(/['"]+/g, '');
        } else {
          const parsed = JSON.parse(session);
          token = parsed.token || '';
        }
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      const res = await axios.post(
        '/api/transfer',
        {
          receiverEmail,
          amount,
          handData,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      // On success, show completion state
      setScanComplete(true);
      setShowHandScan(false);
    } catch (err: any) {
      if (err.response?.data?.error?.includes('Sender not found')) {
        setError('User not found. Please try again.');
        setRetry(true);
      } else {
        setError(err.response?.data?.error || 'Transaction failed. Please try again later.');
        setRetry(true);
      }
    } finally {
      setLoading(false);
      setShowHandScan(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    setRetry(false);
    setError('');
    setSuccess('');
    setStatusMsg('');
    setScanComplete(false);
    setShowHandScan(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#10131c] flex flex-col justify-center items-center relative">
      {/* Status/Error overlays */}
      <div className="absolute top-0 left-0 w-full z-20 flex flex-col items-center mt-6">
        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-center max-w-lg w-full">
            {error}
          </div>
        )}
      </div>
      {/* Full-page scan UI */}
      {showHandScan && !retry && !scanComplete && (
        <div className="flex flex-col items-center justify-center w-full h-full flex-1">
          <HandScan onCancel={handleCancel} onSuccess={handleScanSuccess} demoMode={true} />
        </div>
      )}
      {retry && (
        <div className="flex flex-col items-center justify-center w-full h-full flex-1">
          <button
            onClick={handleRetry}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-black font-medium hover:shadow-lg hover:shadow-neon-green/25 transition-all duration-300 mt-8"
          >
            Try Again
          </button>
        </div>
      )}
      {scanComplete && (
        <div className="flex flex-col items-center justify-center w-full h-full flex-1">
          <div className="mb-4 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 text-center">
            <p>Transaction successful!</p>
            <button
              onClick={handleCancel}
              className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-black font-medium hover:shadow-lg transition-all duration-300"
            >
              Return
            </button>
          </div>
        </div>
      )}
      {/* Cancel button always visible in bottom center */}
      <button
        onClick={handleCancel}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-300 z-30"
      >
        Cancel
      </button>
    </div>
  );
};

export default HandScanVerifyPage;
