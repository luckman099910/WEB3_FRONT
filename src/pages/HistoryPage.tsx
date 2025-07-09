import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { History, ArrowUpRight, ArrowDownLeft, Clock, Hash, User, Mail } from 'lucide-react';
import { api } from '../api/palmPayApi';
import { safeJsonParse } from '../api/palmPayApi';

interface Transaction {
  id: string;
  from_user_email: string;
  to_user_email: string;
  amount: number;
  status: string;
  blockchain_tx: string;
  created_at: string;
  hand_hash: string;
}

const HistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransactionHistory();
  }, []);

  const loadTransactionHistory = async () => {
    try {
      setLoading(true);
      const user = safeJsonParse(localStorage.getItem('user'), {});
      if (!user || !user.id) {
        setError('User not authenticated');
        return;
      }

      const response = await api.get('/api/transactions/history', {
        params: { userId: user.id }
      });
      setTransactions(response.data.transactions || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (transaction: Transaction) => {
    const user = safeJsonParse(localStorage.getItem('user'), {});
    const isSender = transaction.from_user_email === user.email;
    
    return isSender ? (
      <ArrowUpRight className="w-5 h-5 text-red-400" />
    ) : (
      <ArrowDownLeft className="w-5 h-5 text-green-400" />
    );
  };

  const getTransactionType = (transaction: Transaction) => {
    const user = safeJsonParse(localStorage.getItem('user'), {});
    const isSender = transaction.from_user_email === user.email;
    
    return isSender ? 'Sent' : 'Received';
  };

  const getTransactionColor = (transaction: Transaction) => {
    const user = safeJsonParse(localStorage.getItem('user'), {});
    const isSender = transaction.from_user_email === user.email;
    
    return isSender ? 'text-red-400' : 'text-green-400';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-4 animate-pulse">
              <History className="w-8 h-8 text-black" />
            </div>
            <p className="text-white/70 font-light">Loading transaction history...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-6">
              <History className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-light text-white mb-4">Transaction History</h1>
            <p className="text-xl text-white/70 font-light">Your blockchain transaction records</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-3xl bg-red-500/20 border border-red-500/30 text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Transactions List */}
          <div className="space-y-6">
            {transactions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                  <History className="w-8 h-8 text-white/50" />
                </div>
                <p className="text-white/50 font-light text-lg">No transactions found</p>
                <p className="text-white/30 font-light">Your transaction history will appear here</p>
              </motion.div>
            ) : (
              transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-3xl glass-effect border border-white/10 hover:border-neon-green/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-2xl ${getTransactionColor(transaction).replace('text-', 'bg-')}/20`}>
                        {getTransactionIcon(transaction)}
                      </div>
                      <div>
                        <h3 className="text-lg font-light text-white">
                          {getTransactionType(transaction)} {formatAmount(transaction.amount)}
                        </h3>
                        <p className={`text-sm font-light ${getTransactionColor(transaction)}`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/70 font-light text-sm">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-white/50" />
                      <span className="text-white/70 font-light text-sm">From: {transaction.from_user_email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-white/50" />
                      <span className="text-white/70 font-light text-sm">To: {transaction.to_user_email}</span>
                    </div>
                  </div>

                  {transaction.blockchain_tx && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Hash className="w-4 h-4 text-white/50" />
                      <span className="text-white/70 font-light text-sm">
                        TX: {transaction.blockchain_tx.slice(0, 20)}...
                      </span>
                    </div>
                  )}

                  {transaction.hand_hash && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-white/50" />
                      <span className="text-white/70 font-light text-sm">
                        Hash: {transaction.hand_hash.slice(0, 20)}...
                      </span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage; 