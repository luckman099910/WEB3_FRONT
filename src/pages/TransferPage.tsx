import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HandScan from '../components/HandScan';
import { motion } from 'framer-motion';
import { Send, Hand, ArrowLeft, Mail, Phone } from 'lucide-react';
import axios from 'axios';
// @ts-ignore
import config from '../config';

const TransferPage = () => {
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [transferMethod, setTransferMethod] = useState<'email' | 'phone'>('email');
  const [showHandScan, setShowHandScan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setStatusMsg('');
    
    if (transferMethod === 'email' && !receiverEmail) {
      setError('Please enter receiver email address.');
      return;
    }
    
    if (transferMethod === 'phone' && !receiverPhone) {
      setError('Please enter receiver phone number.');
      return;
    }
    
    if (!amount) {
      setError('Please enter amount.');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    setShowHandScan(true);
  };

  const handleHandScanSuccess = async (handData: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setStatusMsg('Processing transfer...');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('session');

      if (!user.id || !token) {
        setError('Please login to continue.');
        setShowHandScan(false);
        return;
      }

      const transferData = {
        amount: parseFloat(amount),
        handData,
        ...(transferMethod === 'email' 
          ? { receiverEmail } 
          : { receiverPhone }
        )
      };

      const response = await axios.post(
        `${config.API_BASE_URL}/api/transfer`,
        transferData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Transfer completed successfully!');
        setStatusMsg(`Transaction ID: ${response.data.transaction.id}`);
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 3000);
      } else {
        setError('Transfer failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Transfer error:', err);
      setError(err.response?.data?.error || 'Transfer failed. Please try again.');
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
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Transfer</span>
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
      <div className="flex justify-center items-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Send className="w-6 h-6 text-neon-green" />
            <h2 className="text-2xl font-light text-white">Send Money</h2>
          </div>

          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
          {statusMsg && <div className="mb-4 text-blue-500 text-center">{statusMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transfer Method Toggle */}
            <div>
              <label className="block text-sm text-white/70 mb-2">Send to</label>
              <div className="flex rounded-full bg-white/10 p-1">
                <button
                  type="button"
                  onClick={() => setTransferMethod('email')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-light transition-all duration-300 flex items-center justify-center space-x-2 ${
                    transferMethod === 'email' 
                      ? 'bg-neon-green text-tech-blue' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransferMethod('phone')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-light transition-all duration-300 flex items-center justify-center space-x-2 ${
                    transferMethod === 'phone' 
                      ? 'bg-neon-green text-tech-blue' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </button>
              </div>
            </div>

            {transferMethod === 'email' ? (
              <div>
                <label className="block text-sm text-white/70 mb-2">Receiver Email</label>
                <input
                  type="email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light"
                  placeholder="receiver@email.com"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm text-white/70 mb-2">Receiver Phone</label>
                <input
                  type="tel"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light"
                  placeholder="+1234567890"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-white/70 mb-2">Amount (INR)</label>
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
              <Send className="w-5 h-5" />
              <span>{loading ? 'Processing...' : 'Send Money'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TransferPage; 