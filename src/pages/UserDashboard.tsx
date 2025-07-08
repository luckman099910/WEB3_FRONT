import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  History, 
  Scan, 
  Gift, 
  Hand, 
  ArrowUpRight, 
  ArrowDownLeft,
  Settings,
  Bell,
  Shield,
  TrendingUp,
  Coffee,
  ShoppingBag,
  Plus,
  Eye,
  EyeOff,
  Coins,
  UserPlus,
  AlertCircle
} from 'lucide-react';
// import { getDashboard } from '../api/palmPayApi';
import PalmRegistration from '../components/PalmRegistration';
import HandScanRegister from '../components/HandScanRegister';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [showBalance, setShowBalance] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock user ID for demo - in real app this would come from auth
  const userId = 'demo-user-id';

  useEffect(() => {
    loadUserDashboard();
  }, []);

  const loadUserDashboard = async () => {
    try {
      setLoading(true);
      // const data = await getDashboard(userId);
      // setUserData(data);
      // Mock data for now
      setUserData({
        user: {
          balance: 123456.78,
          transactions: [
            { txid: 'txn1234567890abcdef1234567890abcdef', amount: 1000, created_at: '2023-10-27T10:00:00Z' },
            { txid: 'txn1234567890abcdef1234567890abcdef', amount: -500, created_at: '2023-10-27T09:30:00Z' },
            { txid: 'txn1234567890abcdef1234567890abcdef', amount: 200, created_at: '2023-10-27T09:00:00Z' },
          ]
        },
        transactions: [
          { id: 1, type: 'payment', merchant: 'Starbucks Coffee', amount: -450, time: '2 hours ago', status: 'completed' },
          { id: 2, type: 'received', merchant: 'Salary Credit', amount: 75000, time: '1 day ago', status: 'completed' },
          { id: 3, type: 'payment', merchant: 'Amazon Shopping', amount: -1250, time: '2 days ago', status: 'completed' },
          { id: 4, type: 'payment', merchant: 'Uber Ride', amount: -280, time: '3 days ago', status: 'completed' },
        ]
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = (userData: any) => {
    setUserData(userData);
    setShowRegistration(false);
    loadUserDashboard(); // Refresh data
  };

  const transactions = [
    {
      id: 1,
      type: 'payment',
      merchant: 'Starbucks Coffee',
      amount: -450,
      time: '2 hours ago',
      status: 'completed',
      icon: Coffee
    },
    {
      id: 2,
      type: 'received',
      merchant: 'Salary Credit',
      amount: 75000,
      time: '1 day ago',
      status: 'completed',
      icon: ArrowDownLeft
    },
    {
      id: 3,
      type: 'payment',
      merchant: 'Amazon Shopping',
      amount: -1250,
      time: '2 days ago',
      status: 'completed',
      icon: ShoppingBag
    },
    {
      id: 4,
      type: 'payment',
      merchant: 'Uber Ride',
      amount: -280,
      time: '3 days ago',
      status: 'completed',
      icon: ArrowUpRight
    }
  ];

  const tabs = [
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'history', label: 'History', icon: History },
    { id: 'consent', label: 'Consent', icon: Scan },
    { id: 'rewards', label: 'Rewards', icon: Gift }
  ];

  if (showRegistration) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <HandScanRegister onCancel={() => setShowRegistration(false)} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-4 animate-pulse-glow">
            <Wallet className="w-8 h-8 text-black" />
          </div>
          <p className="text-white/70 font-ultralight">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-400 mb-4">
            <AlertCircle className="w-8 h-8 text-black" />
          </div>
          <p className="text-red-400 font-ultralight mb-4">{error}</p>
          <button
            onClick={loadUserDashboard}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'wallet':
        return (
          <div className="space-y-6">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative p-8 rounded-3xl bg-gradient-to-br from-fintech-green/20 to-electric-blue/20 border border-fintech-green/30 backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fintech-green/5 to-electric-blue/5 animate-pulse"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white/70 font-ultralight">Available Balance</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-ultralight text-white">
                        {showBalance ? `₹${userData?.user?.balance?.toLocaleString() || '0'}` : '₹••••••'}
                      </span>
                      <button 
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300"
                      >
                        {showBalance ? (
                          <EyeOff className="w-5 h-5 text-white/70" />
                        ) : (
                          <Eye className="w-5 h-5 text-white/70" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="p-4 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-2 animate-pulse-glow">
                      <Wallet className="w-8 h-8 text-black" />
                    </div>
                    <p className="text-sm text-fintech-green font-ultralight">+12.5% this month</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-fintech-green to-electric-blue text-white font-medium shadow-lg hover:scale-[1.02] transition-transform duration-200"
                    onClick={() => setShowRegistration(true)}
                  >
                    <Hand className="w-5 h-5" />
                    Register Palm
                  </button>
                  <button className="flex items-center space-x-2 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 group">
                    <ArrowUpRight className="w-5 h-5 text-electric-blue group-hover:scale-110 transition-transform" />
                    <span className="text-white font-ultralight">Send Money</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {userData?.transactions?.slice(0, 3).map((transaction: any, index: number) => (
                  <div key={transaction.txid || index} className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div className={`p-3 rounded-2xl ${transaction.amount > 0 ? 'bg-fintech-green/20' : 'bg-red-400/20'}`}>
                      <Hand className={`w-5 h-5 ${transaction.amount > 0 ? 'text-fintech-green' : 'text-red-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-ultralight">Transaction #{transaction.txid?.slice(0, 8)}</p>
                      <p className="text-white/50 font-ultralight text-sm">{new Date(transaction.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-ultralight ${transaction.amount > 0 ? 'text-fintech-green' : 'text-white'}`}>
                        {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <p className="text-white/50 font-ultralight">No transactions yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-4">Transaction History</h3>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div className={`p-3 rounded-2xl ${transaction.amount > 0 ? 'bg-fintech-green/20' : 'bg-red-400/20'}`}>
                      <transaction.icon className={`w-5 h-5 ${transaction.amount > 0 ? 'text-fintech-green' : 'text-red-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-ultralight">{transaction.merchant}</p>
                      <p className="text-white/50 font-ultralight text-sm">{transaction.time}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-ultralight ${transaction.amount > 0 ? 'text-fintech-green' : 'text-white'}`}>
                        {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-fintech-green font-ultralight text-xs">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'consent':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-4">Biometric Consent Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-fintech-green/10 border border-fintech-green/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-fintech-green/20">
                      <Shield className="w-5 h-5 text-fintech-green" />
                    </div>
                    <div>
                      <p className="text-white font-ultralight">Consent Status</p>
                      <p className="text-fintech-green font-ultralight text-sm">Active & Verified</p>
                    </div>
                  </div>
                  <div className="text-fintech-green">✓</div>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/5">
                  <div className="flex items-center space-x-3 mb-3">
                    <Hand className="w-6 h-6 text-electric-blue" />
                    <span className="text-white font-ultralight">Palm Hash Preview</span>
                  </div>
                  <p className="text-white/70 font-mono text-sm bg-white/10 p-3 rounded-2xl">
                    a1b2c3d4e5f6...xyz789
                  </p>
                  <p className="text-white/50 font-ultralight text-xs mt-2">
                    This is your encrypted biometric identifier. Original data is never stored.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'rewards':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-purple-400/30 backdrop-blur-xl"
            >
              <h3 className="text-xl font-ultralight text-white mb-4">PalmPoints Balance</h3>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-4">
                  <Coins className="w-8 h-8 text-black" />
                </div>
                <p className="text-3xl font-ultralight text-white mb-2">7,543</p>
                <p className="text-fintech-green font-ultralight">Gold Tier Member</p>
              </div>
              
              <div className="relative mb-6">
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-fintech-green to-electric-blue h-3 rounded-full transition-all duration-1000"
                    style={{ width: '75%' }}
                  />
                </div>
                <p className="text-center text-white/70 font-ultralight text-sm mt-2">
                  2,457 points until Platinum
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-4">Referral Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-2xl bg-white/5">
                  <p className="text-2xl font-ultralight text-white mb-1">12</p>
                  <p className="text-white/70 font-ultralight text-sm">Successful Referrals</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5">
                  <p className="text-2xl font-ultralight text-fintech-green mb-1">1,200</p>
                  <p className="text-white/70 font-ultralight text-sm">Bonus Points Earned</p>
                </div>
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <section className="mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-ultralight text-white mb-2">
                Welcome back, Alex
              </h1>
              <p className="text-white/70 font-ultralight">
                Your secure palm payment dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                <Bell className="w-6 h-6 text-white" />
              </button>
              <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                <Settings className="w-6 h-6 text-white" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex space-x-2 p-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-fintech-green to-electric-blue text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-ultralight hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tab Content */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderTabContent()}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;