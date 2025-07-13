import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HandScan from '../components/HandScan';
import { motion } from 'framer-motion';
import { Hand, Download, Mail, Phone } from 'lucide-react';
import axios from 'axios';
// @ts-ignore
import config from '../config';

const ReceivePage = () => {
  const [amount, setAmount] = useState('');
  const [showHandScan, setShowHandScan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const navigate = useNavigate();

  // Get current user's information from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const receiverEmail = user?.email || '';
  const receiverPhone = user?.phone || '';

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
    setLoading(true);
    setError('');
    setSuccess('');
    setStatusMsg('Processing receive request...');

    try {
      const token = localStorage.getItem('session');
      if (!user.id || !token) {
        setError('Please login to continue.');
        setShowHandScan(false);
        return;
      }
      // Send receive request to backend using transaction endpoint
      const response = await axios.post(
        '/api/transaction',
        {
          handData,
          merchantId: user.id, // Use user's own ID as merchant for receive
          amount: parseFloat(amount),
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (response.data && response.data.txid) {
        setSuccess('Receive request processed!');
        setStatusMsg(`Transaction ID: ${response.data.txid}`);
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 3000);
      } else {
        setError('Receive request failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Receive error:', err);
      setError(err.response?.data?.message || 'Receive request failed. Please try again.');
    } finally {
      setLoading(false);
      setShowHandScan(false);
    }
  };

  const handleCancel = () => {
    setShowHandScan(false);
    setError('');
    setSuccess('');
    setStatusMsg('');
  };

  if (showHandScan) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[70vh]" style={{height:"100vh"}}>
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <span>Back to Receive</span>
              </button>
            </div>
            <HandScan
              onSuccess={handleHandScanSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]" style={{height:"100vh"}}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Download className="w-6 h-6 text-neon-green" />
            <h2 className="text-2xl font-light text-white">Receive Money</h2>
          </div>

          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
          {statusMsg && <div className="mb-4 text-blue-500 text-center">{statusMsg}</div>}

          {/* User's Receive Information */}
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-light text-white mb-3">Your Receive Details</h3>
            <div className="space-y-2">
              {receiverEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-neon-green" />
                  <span className="text-white/80 font-light">{receiverEmail}</span>
                </div>
              )}
              {receiverPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-neon-green" />
                  <span className="text-white/80 font-light">{receiverPhone}</span>
                </div>
              )}
              {!receiverEmail && !receiverPhone && (
                <p className="text-white/60 text-sm">No contact information available</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">Expected Amount (INR)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium flex items-center justify-center space-x-2"
              disabled={loading}
            >
              <Download className="w-5 h-5" />
              <span>{loading ? 'Processing...' : 'Confirm Receive'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Share your email or phone number with others to receive money
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ReceivePage; 