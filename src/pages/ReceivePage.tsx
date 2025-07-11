import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HandScan from '../components/HandScan';
import { motion } from 'framer-motion';
import { Hand, Download } from 'lucide-react';
import axios from 'axios';

const ReceivePage = () => {
  const [amount, setAmount] = useState('');
  const [showHandScan, setShowHandScan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const navigate = useNavigate();

  // Get current user's email from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const receiverEmail = user?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setStatusMsg('');
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setShowHandScan(true);
  };

  const handleHandScanSuccess = async (handData: string) => {
    setShowHandScan(false);
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
      const tx = res.data?.transaction;
      setSuccess('Remittance successful!');
      setStatusMsg(`${tx?.amount} INR was successfully transmitted from ${tx?.from_user_email} to ${tx?.to_user_email}.`);
      setAmount('');
    } catch (err: any) {
      if (err.response?.data?.error?.includes('Sender not found')) {
        setShowRegisterPrompt(true);
      } else {
        setError(err.response?.data?.error || 'Remittance failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowHandScan(false);
    setError('');
    setSuccess('');
    setStatusMsg('');
    setShowRegisterPrompt(false);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-sky-blue mb-4">
              <Download className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-light text-white mb-2">Receive Money</h2>
            <p className="text-white/70">Request a remittance to your wallet. Sender will be authenticated by palm scan.</p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 text-center">
              {success}
            </div>
          )}

          {statusMsg && (
            <div className="mb-4 p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-center">
              {statusMsg}
            </div>
          )}

          {showRegisterPrompt && (
            <div className="mb-4 p-4 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-700 text-center">
              Sender not found. Please re-register your palm.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-black font-medium hover:shadow-lg hover:shadow-neon-green/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Hand className="w-5 h-5" />
                  Receive
                </>
              )}
            </button>
          </form>

          {showHandScan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-[#10131c] rounded-2xl p-6 max-w-2xl w-full relative shadow-2xl">
                <button
                  onClick={handleCancel}
                  className="absolute top-4 right-4 text-white hover:text-neon-green text-2xl font-bold"
                >
                  ×
                </button>
                <HandScan onCancel={handleCancel} onSuccess={handleHandScanSuccess} />
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/user-dashboard')}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ReceivePage; 