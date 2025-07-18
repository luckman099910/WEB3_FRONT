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
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { api, safeJsonParse } from '../api/palmPayApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [showBalance, setShowBalance] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationsActive, setNotificationsActive] = useState(() => {
    // Persist notification state in localStorage
    return localStorage.getItem('notificationsActive') === 'true';
  });
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [originalPassword, setOriginalPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Mock user ID for demo - in real app this would come from auth
  const userId = 'demo-user-id';

  const navigate = useNavigate();

  useEffect(() => {
    loadUserDashboard();
  }, []);

  const loadUserDashboard = async () => {
    try {
      setLoading(true);
      const user = safeJsonParse(localStorage.getItem('user'), {});
      if (!user || !user.id) throw new Error('User not logged in');
      const res = await api.get(`/api/dashboard`, { params: { userId: user.id } });
      setUserData(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = () => {
    setNotificationsActive((prev) => {
      const next = !prev;
      localStorage.setItem('notificationsActive', next ? 'true' : 'false');
      toast(next ? 'Notifications activated!' : 'Notifications deactivated!');
      return next;
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setChangingPassword(true);
    try {
      const user = safeJsonParse(localStorage.getItem('user'), {});
      const res = await api.post('/api/auth/change-password', {
        userId: user.id,
        originalPassword,
        newPassword
      });
      if (res.data.success) {
        toast.success('Password changed successfully!');
        setShowPasswordModal(false);
        setOriginalPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.data.message || 'Failed to change password.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
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

  // Helper to get transaction field from item.tx or fallback
  const getTxField = (item: any, field: string): any => (item.tx && typeof item.tx === 'object' && field in item.tx) ? item.tx[field] : item[field];

  // Get current user's email
  const userEmail = userData?.user?.email;


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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-medium shadow-lg hover:scale-[1.02] transition-transform duration-200 ${userData?.user?.handinfo ? 'bg-green-900/80 text-neon-green' : 'bg-gradient-to-r from-fintech-green to-electric-blue text-white'}`}
                    onClick={() => navigate('/palm-register')}
                  >
                    <Hand className="w-5 h-5" />
                    {userData?.user?.handinfo ? (
                      <>
                        REGISTERED <CheckCircle className="w-5 h-5 ml-2 text-neon-green" />
                      </>
                    ) : (
                      'Register Palm'
                    )}
                  </button>
                  <button
                    className="flex items-center space-x-2 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 group"
                    onClick={() => navigate('/transfer')}
                  >
                    <ArrowUpRight className="w-5 h-5 text-electric-blue group-hover:scale-110 transition-transform" />
                    <span className="text-white font-ultralight">Send Money</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Recent History (10 most recent) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-4">Recent History</h3>
              <div className="space-y-3">
                {Array.isArray(userData?.user?.user_history) && userData.user.user_history.length > 0 ? (
                  [...userData.user.user_history]
                    .sort((a, b) => new Date(b.time || b.created_at).getTime() - new Date(a.time || a.created_at).getTime())
                    .slice(0, 10)
                    .map((item, idx) => {
                      const isSent = item.sender === userEmail;
                      const isReceived = item.receiver === userEmail;
                      return (
                        <div key={item.time || idx} className="flex items-center space-x-4 p-4 pt-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300" style={{ marginBottom: "15px" }}>
                          <div className={`p-3 rounded-2xl ${item.type === 'palm_registration' || item.type === 'palm_manual_scan' ? 'bg-electric-blue/20' : item.amount > 0 ? 'bg-fintech-green/20' : 'bg-red-400/20'}`}>
                            {item.type === 'palm_registration' || item.type === 'palm_manual_scan' ? (
                              <Hand className="w-5 h-5 text-electric-blue" />
                            ) : (
                              <Hand className={`w-5 h-5 ${isSent ? 'text-red-400' : isReceived ? 'text-fintech-green' : 'text-white'}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-ultralight">
                              {item.type === 'palm_registration' && 'Palm Registered'}
                              {item.type === 'palm_manual_scan' && `Manual Palm Scan (${item.status})`}
                              {item.type !== 'palm_registration' && item.type !== 'palm_manual_scan' && (
                                <span className="flex items-center gap-2 flex-wrap">
                                  {`Transaction #${String(getTxField(item, 'txid') || item.txid).slice(0, 8)}`}
                                  {item.tx && (
                                    <span className="relative ml-2">
                                      <button
                                        className="text-xs text-cyan-400 font-mono bg-white/10 px-2 py-1 rounded hover:bg-cyan-900/30 transition-all duration-200 max-w-[160px] truncate"
                                        style={{ cursor: 'pointer' }}
                                        title={item.tx}
                                        onClick={() => {
                                          navigator.clipboard.writeText(item.tx);
                                          setCopiedIdx(idx);
                                          setTimeout(() => setCopiedIdx(null), 1200);
                                        }}
                                      >
                                        {item.tx.slice(0, 10)}...{item.tx.slice(-6)}
                                      </button>
                                      {copiedIdx === idx && (
                                        <span className="absolute left-1/2 -translate-x-1/2 -top-7 bg-black text-white text-xs rounded px-2 py-1 z-10">
                                          Copied!
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </span>
                              )}
                            </p>
                            <p className="text-white/50 font-ultralight text-sm">{item.time ? new Date(item.time).toLocaleString() : item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>
                            {item.similarity !== undefined && (
                              <p className="text-white/50 font-ultralight text-xs">Similarity: {item.similarity?.toFixed(1)}%</p>
                            )}
                          </div>
                          <div className="text-right">
                            {item.type === 'palm_registration' && <span className="text-neon-green font-ultralight text-xs">Completed</span>}
                            {item.type === 'palm_manual_scan' && (
                              <span className={`font-ultralight text-xs ${item.status === 'success' ? 'text-neon-green' : 'text-red-400'}`}>{item.status === 'success' ? 'Success' : 'Fail'}</span>
                            )}
                            {item.type !== 'palm_registration' && item.type !== 'palm_manual_scan' && (
                              <>
                                <p className={`font-ultralight ${isSent ? 'text-red-400' : isReceived ? 'text-fintech-green' : 'text-white'}`}>{isReceived ? '+' : isSent ? '-' : ''}₹{Math.abs(getTxField(item, 'amount')).toLocaleString()}</p>
                                <p className={`font-ultralight text-xs ${String(getTxField(item, 'status')).toLowerCase() === 'completed' ? 'text-fintech-green' : 'text-red-400'}`}>{getTxField(item, 'status') || 'Completed'}</p>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/50 font-ultralight">No history found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );

      case 'history':
        const history = Array.isArray(userData?.user?.user_history) ? userData.user.user_history : [];
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h3 className="text-xl font-ultralight text-white mb-4">History</h3>
              {history.length === 0 ? (
                <div className="text-white/50 text-center py-8">No history yet.</div>
              ) : (
                history.map((item: any, idx: number) => {
                  const isSent = item.sender === userEmail;
                  const isReceived = item.receiver === userEmail;
                  return (
                    <div key={item.time || idx} className="flex items-center space-x-4 p-4 pt-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300" style={{ marginBottom: "15px" }}>
                      <div className={`p-3 rounded-2xl ${item.type === 'palm_registration' || item.type === 'palm_manual_scan' ? 'bg-electric-blue/20' : item.amount > 0 ? 'bg-fintech-green/20' : 'bg-red-400/20'}`}>
                        {item.type === 'palm_registration' || item.type === 'palm_manual_scan' ? (
                          <Hand className="w-5 h-5 text-electric-blue" />
                        ) : (
                          <Hand className={`w-5 h-5 ${isSent ? 'text-red-400' : isReceived ? 'text-fintech-green' : 'text-white'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-ultralight">
                          {item.type === 'palm_registration' && 'Palm Registered'}
                          {item.type === 'palm_manual_scan' && `Manual Palm Scan (${item.status})`}
                          {item.type !== 'palm_registration' && item.type !== 'palm_manual_scan' && (
                            <span className="flex items-center gap-2 flex-wrap">
                              {`Transaction #${String(getTxField(item, 'txid') || item.txid).slice(0, 8)}`}
                              {item.tx && (
                                <span className="relative ml-2">
                                  <button
                                    className="text-xs text-cyan-400 font-mono bg-white/10 px-2 py-1 rounded hover:bg-cyan-900/30 transition-all duration-200 max-w-[160px] truncate"
                                    style={{ cursor: 'pointer' }}
                                    title={item.tx}
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.tx);
                                      setCopiedIdx(idx);
                                      setTimeout(() => setCopiedIdx(null), 1200);
                                    }}
                                  >
                                    {item.tx.slice(0, 10)}...{item.tx.slice(-6)}
                                  </button>
                                  {copiedIdx === idx && (
                                    <span className="absolute left-1/2 -translate-x-1/2 -top-7 bg-black text-white text-xs rounded px-2 py-1 z-10">
                                      Copied!
                                    </span>
                                  )}
                                </span>
                              )}
                            </span>
                          )}
                        </p>
                        <p className="text-white/50 font-ultralight text-sm">{item.time ? new Date(item.time).toLocaleString() : item.created_at ? new Date(item.created_at).toLocaleString() : ''}</p>
                        {item.similarity !== undefined && (
                          <p className="text-white/50 font-ultralight text-xs">Similarity: {item.similarity?.toFixed(1)}%</p>
                        )}
                      </div>
                      <div className="text-right">
                        {item.type === 'palm_registration' && <span className="text-neon-green font-ultralight text-xs">Completed</span>}
                        {item.type === 'palm_manual_scan' && (
                          <span className={`font-ultralight text-xs ${item.status === 'success' ? 'text-neon-green' : 'text-red-400'}`}>{item.status === 'success' ? 'Success' : 'Fail'}</span>
                        )}
                        {item.type !== 'palm_registration' && item.type !== 'palm_manual_scan' && (
                          <>
                            <p className={`font-ultralight ${isSent ? 'text-red-400' : isReceived ? 'text-fintech-green' : 'text-white'}`}>{isReceived ? '+' : isSent ? '-' : ''}₹{Math.abs(getTxField(item, 'amount')).toLocaleString()}</p>
                            <p className={`font-ultralight text-xs ${String(getTxField(item, 'status')).toLowerCase() === 'completed' ? 'text-fintech-green' : 'text-red-400'}`}>{getTxField(item, 'status') || 'Completed'}</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          </div>
        );

      case 'consent':
        const handinfo = userData?.user?.palm_hash;
        const hasPalm = !!handinfo && handinfo !== 'null' && handinfo !== 'undefined';
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
                <div className={`flex items-center justify-between p-4 rounded-2xl ${hasPalm ? 'bg-fintech-green/10 border border-fintech-green/30' : 'bg-yellow-900/20 border border-yellow-500/30'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${hasPalm ? 'bg-fintech-green/20' : 'bg-yellow-500/20'}`}>
                      <Shield className={`w-5 h-5 ${hasPalm ? 'text-fintech-green' : 'text-yellow-400'}`} />
                    </div>
                    <div>
                      <p className="text-white font-ultralight">Consent Status</p>
                      {hasPalm ? (
                        <p className="text-fintech-green font-ultralight text-sm">Active & Verified</p>
                      ) : (
                        <p className="text-yellow-400 font-ultralight text-sm">Palm not registered</p>
                      )}
                    </div>
                  </div>
                  <div className={hasPalm ? 'text-fintech-green' : 'text-yellow-400'}>{hasPalm ? '✓' : '!'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5">
                  <div className="flex items-center space-x-3 mb-3">
                    <Hand className="w-6 h-6 text-electric-blue" />
                    <span className="text-white font-ultralight">Palm Hash Preview</span>
                  </div>
                  {hasPalm ? (
                    <p className="text-white/70 font-mono text-sm bg-white/10 p-3 rounded-2xl">{handinfo}</p>
                  ) : (
                    <p className="text-yellow-400 font-mono text-sm bg-white/10 p-3 rounded-2xl">No biometric data found</p>
                  )}
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
    <div className="min-h-screen py-20" style={{ paddingTop: "7rem" }}>
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
                Welcome back, {userData?.user?.username || userData?.user?.email || 'User'}
              </h1>
              <p className="text-white/70 font-ultralight font-mono">
                Palmpay ID: {userData?.user?.palm_hash || 'N/A'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button
                className={`p-3 rounded-2xl transition-all duration-300 ${notificationsActive ? 'bg-gradient-to-r from-fintech-green to-electric-blue text-black shadow-lg shadow-fintech-green/30 animate-glow' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                onClick={handleToggleNotifications}
                title={notificationsActive ? 'Notifications are ON' : 'Notifications are OFF'}
              >
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300" onClick={() => setShowPasswordModal(true)}>
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
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === tab.id
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

      <Dialog open={showPasswordModal} onClose={() => setShowPasswordModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/60" />
          <Dialog.Panel className="relative bg-[#181c23] rounded-2xl max-w-md w-full mx-auto p-8 z-10 border border-white/10">
            <Dialog.Title className="text-xl font-ultralight text-white mb-4">Change Password</Dialog.Title>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-white/70 font-ultralight mb-1">Original Password</label>
                <input type="password" className="w-full px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fintech-green" value={originalPassword} onChange={e => setOriginalPassword(e.target.value)} autoFocus />
              </div>
              <div>
                <label className="block text-white/70 font-ultralight mb-1">New Password</label>
                <input type="password" className="w-full px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fintech-green" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div>
                <label className="block text-white/70 font-ultralight mb-1">Confirm New Password</label>
                <input type="password" className="w-full px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fintech-green" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20" onClick={() => setShowPasswordModal(false)} disabled={changingPassword}>Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg transition-all duration-300" disabled={changingPassword}>{changingPassword ? 'Changing...' : 'Change Password'}</button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserDashboard;