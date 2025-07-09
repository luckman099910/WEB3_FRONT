import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HandScanRegister from '../components/HandScanRegister';
import { motion } from 'framer-motion';
import { Send, Hand, ArrowLeft } from 'lucide-react';

const TransferPage = () => {
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [showHandScan, setShowHandScan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!receiverEmail || !amount) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    // Show hand scan for authentication
    setShowHandScan(true);
  };

  const handleHandScanSuccess = async (handData: string) => {
    setLoading(true);
    try {
      // This will be handled by the backend API
      // The hand scan data will be used to authenticate the sender
      setSuccess('Transfer initiated. Please complete hand scan authentication.');
    } catch (err: any) {
      setError(err.message || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowHandScan(false);
    setError('');
    setSuccess('');
  };

  if (showHandScan) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="w-full max-w-2xl">
            <div className="mb-6 text-center">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Transfer
              </button>
              <h2 className="text-2xl font-light text-white mb-2">Hand Scan Authentication</h2>
              <p className="text-white/70">Please scan your palm to confirm the transfer</p>
            </div>
            <HandScanRegister onCancel={handleCancel} />
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
          className="w-full max-w-md p-8 rounded-3xl glass-effect border border-white/20 shadow-xl"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-4">
              <Send className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-light text-white mb-2">Send Money</h2>
            <p className="text-white/70">Transfer money securely with palm authentication</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">Receiver Email</label>
              <input
                type="email"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 backdrop-blur-sm transition-all duration-300 font-light"
                placeholder="recipient@email.com"
                required
              />
            </div>

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
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Hand className="w-5 h-5" />
                  Send Money
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/history')}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              View Transaction History
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TransferPage; 