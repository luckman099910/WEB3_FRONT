import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  CreditCard, 
  QrCode, 
  Hand, 
  Banknote, 
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Share2,
  Copy,
  Bell,
  Eye,
  Filter,
  AlertCircle
} from 'lucide-react';
// import { getMerchantPayments } from '../api/palmPayApi';
import TransactionProcessor from '../components/TransactionProcessor';

const StoreDashboard = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [showTransactionProcessor, setShowTransactionProcessor] = useState(false);
  const [merchantData, setMerchantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock merchant ID for demo - in real app this would come from auth
  const merchantId = 'demo-merchant-id';

  useEffect(() => {
    loadMerchantData();
  }, []);

  const loadMerchantData = async () => {
    try {
      setLoading(true);
      // const data = await getMerchantPayments(merchantId);
      // setMerchantData(data);
      // Mock data for now
      setMerchantData({
        merchant: {
          balance: 123456.78,
          total_sales: 150000,
          total_transactions: 1200,
          average_transaction: 125,
          success_rate: 99.2,
          avg_scan_time: 1.2,
          total_withdrawals: 50000,
          total_customers: 1000,
          total_qr_codes_generated: 100,
          total_palm_scans: 12000,
        },
        payments: [
          { txid: 'TXN12345678901234567890123456789012', amount: 1200, status: 'completed', created_at: '2023-10-27T10:00:00Z' },
          { txid: 'TXN12345678901234567890123456789013', amount: 500, status: 'completed', created_at: '2023-10-27T10:05:00Z' },
          { txid: 'TXN12345678901234567890123456789014', amount: 200, status: 'completed', created_at: '2023-10-27T10:10:00Z' },
          { txid: 'TXN12345678901234567890123456789015', amount: 100, status: 'completed', created_at: '2023-10-27T10:15:00Z' },
          { txid: 'TXN12345678901234567890123456789016', amount: 700, status: 'completed', created_at: '2023-10-27T10:20:00Z' },
        ],
        withdrawals: [
          { amount: 10000, date: '2023-10-25T10:00:00Z', status: 'completed' },
          { amount: 15000, date: '2023-10-20T10:00:00Z', status: 'completed' },
          { amount: 8500, date: '2023-10-18T10:00:00Z', status: 'completed' },
        ],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load merchant data');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSuccess = (result: any) => {
    setShowTransactionProcessor(false);
    loadMerchantData(); // Refresh data
  };

  const recentPayments = [
    {
      id: 1,
      customer: 'John Doe',
      amount: 450,
      method: 'palm',
      time: '2 minutes ago',
      scanId: 'PS-2024-001'
    },
    {
      id: 2,
      customer: 'Sarah Wilson',
      amount: 1250,
      method: 'palm',
      time: '15 minutes ago',
      scanId: 'PS-2024-002'
    },
    {
      id: 3,
      customer: 'Mike Johnson',
      amount: 780,
      method: 'palm',
      time: '32 minutes ago',
      scanId: 'PS-2024-003'
    },
    {
      id: 4,
      customer: 'Emma Davis',
      amount: 320,
      method: 'palm',
      time: '1 hour ago',
      scanId: 'PS-2024-004'
    }
  ];

  const tabs = [
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'palm', label: 'Accept Palm', icon: Hand },
    { id: 'qr', label: 'Generate QR', icon: QrCode },
    { id: 'withdraw', label: 'Withdraw', icon: Banknote },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (showTransactionProcessor) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <TransactionProcessor 
          merchantId={merchantId}
          onSuccess={handleTransactionSuccess}
          onClose={() => setShowTransactionProcessor(false)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-4 animate-pulse-glow">
            <Store className="w-8 h-8 text-black" />
          </div>
          <p className="text-white/70 font-ultralight">Loading merchant dashboard...</p>
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
            onClick={loadMerchantData}
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
      case 'payments':
        return (
          <div className="space-y-6">
            {/* Today's Earnings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-fintech-green/20 to-electric-blue/20 border border-fintech-green/30 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fintech-green/5 to-electric-blue/5 animate-pulse"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-white/70 font-ultralight mb-2">Today's Sales</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-ultralight text-white">₹{merchantData?.merchant?.balance?.toLocaleString() || '0'}</span>
                    <div className="flex items-center space-x-1 text-fintech-green">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm font-ultralight">+23.5%</span>
                    </div>
                  </div>
                  <p className="text-white/50 font-ultralight text-sm mt-1">{merchantData?.payments?.length || 0} transactions</p>
                </div>
                <div className="text-right">
                  <div className="p-4 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-2 animate-pulse-glow">
                    <DollarSign className="w-8 h-8 text-black" />
                  </div>
                  <p className="text-sm text-electric-blue font-ultralight">Real-time</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Users, title: 'Customers Today', value: '47', color: 'from-blue-400 to-cyan-400' },
                { icon: Hand, title: 'Palm Scans', value: '43', color: 'from-fintech-green to-electric-blue' },
                { icon: TrendingUp, title: 'Avg. Transaction', value: '₹392', color: 'from-orange-400 to-red-400' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-ultralight text-white">{stat.value}</span>
                  </div>
                  <p className="text-white/70 font-ultralight text-sm mt-2">{stat.title}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Payments Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-ultralight text-white">Recent Payments</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <Filter className="w-5 h-5 text-white/70" />
                  </button>
                  <button className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <Download className="w-5 h-5 text-white/70" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {merchantData?.payments?.map((payment: any, index: number) => (
                  <div key={payment.txid || index} className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div className="p-3 rounded-2xl bg-fintech-green/20">
                      <Hand className="w-5 h-5 text-fintech-green" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-ultralight">Transaction #{payment.txid?.slice(0, 8)}</p>
                          <p className="text-white/50 font-ultralight text-sm">{new Date(payment.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-ultralight">₹{payment.amount?.toLocaleString()}</p>
                          <p className="text-white/50 font-ultralight text-sm">{payment.status}</p>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                      <Eye className="w-5 h-5 text-white/70" />
                    </button>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <p className="text-white/50 font-ultralight">No payments yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );

      case 'palm':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-fintech-green/20 to-electric-blue/20 border border-fintech-green/30 backdrop-blur-xl"
            >
              <h3 className="text-xl font-ultralight text-white mb-6">PalmScan Mode</h3>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-6 animate-pulse-glow">
                  <Hand className="w-16 h-16 text-black" />
                </div>
                <h4 className="text-2xl font-ultralight text-white mb-2">Ready to Accept Payments</h4>
                <p className="text-white/70 font-ultralight mb-6">
                  Customers can now scan their palm to complete payments instantly
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => setShowTransactionProcessor(true)}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300 animate-glow"
                  >
                    Process Payment
                  </button>
                  <button className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 hover:border-fintech-green/50 transition-all duration-300 font-ultralight">
                    Test Mode
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-4">Scanner Statistics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 font-ultralight">Success Rate</span>
                    <span className="text-fintech-green font-ultralight">99.2%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-fintech-green h-2 rounded-full" style={{ width: '99.2%' }}></div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 font-ultralight">Avg. Scan Time</span>
                    <span className="text-electric-blue font-ultralight">1.2s</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-electric-blue h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'qr':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-6">QR Code Generator</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-ultralight text-white/70 mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm font-ultralight"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-ultralight text-white/70 mb-2">Description</label>
                    <input
                      type="text"
                      placeholder="Payment description"
                      className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm font-ultralight"
                    />
                  </div>
                  <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300 animate-glow">
                    <QrCode className="w-5 h-5" />
                    <span>Generate QR Code</span>
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="p-8 rounded-3xl bg-white border border-white/20 mb-4">
                    <div className="w-48 h-48 mx-auto bg-black rounded-2xl flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                      <Share2 className="w-4 h-4 text-white/70" />
                      <span className="text-white/70 font-ultralight text-sm">Share</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                      <Copy className="w-4 h-4 text-white/70" />
                      <span className="text-white/70 font-ultralight text-sm">Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'withdraw':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-6">Withdraw Funds</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-fintech-green/10 border border-fintech-green/30">
                    <h4 className="text-lg font-ultralight text-white mb-2">Available Balance</h4>
                    <p className="text-3xl font-ultralight text-fintech-green">₹45,230</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-ultralight text-white/70 mb-2">Withdrawal Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm font-ultralight"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-ultralight text-white/70 mb-2">Bank Account</label>
                    <select className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm font-ultralight">
                      <option>HDFC Bank - ****1234</option>
                      <option>SBI Bank - ****5678</option>
                    </select>
                  </div>
                  
                  <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300 animate-glow">
                    <Banknote className="w-5 h-5" />
                    <span>Withdraw Funds</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-ultralight text-white mb-4">Recent Withdrawals</h4>
                  {[
                    { amount: 10000, date: '2 days ago', status: 'completed' },
                    { amount: 15000, date: '1 week ago', status: 'completed' },
                    { amount: 8500, date: '2 weeks ago', status: 'completed' }
                  ].map((withdrawal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                      <div>
                        <p className="text-white font-ultralight">₹{withdrawal.amount.toLocaleString()}</p>
                        <p className="text-white/50 font-ultralight text-sm">{withdrawal.date}</p>
                      </div>
                      <span className="text-fintech-green font-ultralight text-sm">Completed</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-6">Store Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-ultralight text-white/70 mb-2">Store Name</label>
                  <input
                    type="text"
                    value="The Coffee Shop"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm font-ultralight"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-ultralight text-white/70 mb-2">Business Category</label>
                  <select className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm font-ultralight">
                    <option>Food & Beverages</option>
                    <option>Retail</option>
                    <option>Services</option>
                  </select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-ultralight text-white/70 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value="shop@example.com"
                      className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm font-ultralight"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-ultralight text-white/70 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm font-ultralight"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-lg font-ultralight text-white mb-4">Notification Preferences</h4>
                  <div className="space-y-3">
                    {[
                      'Email notifications for new payments',
                      'SMS alerts for large transactions',
                      'Weekly summary reports',
                      'Marketing updates'
                    ].map((pref, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={index < 2}
                          className="w-4 h-4 text-fintech-green bg-white/10 border-white/20 rounded focus:ring-fintech-green"
                        />
                        <span className="text-white/70 font-ultralight">{pref}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300 animate-glow">
                  <Settings className="w-5 h-5" />
                  <span>Save Settings</span>
                </button>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-ultralight text-white mb-2">
                The Coffee Shop
              </h1>
              <p className="text-white/70 font-ultralight">
                Merchant dashboard for palm payment management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                <Bell className="w-6 h-6 text-white" />
              </button>
              <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex space-x-2 p-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-x-auto"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-fintech-green to-electric-blue text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-ultralight">{tab.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tab Content */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderTabContent()}
        </div>
      </section>
    </div>
  );
};

export default StoreDashboard;