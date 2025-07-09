import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Hand, 
  Users, 
  CreditCard, 
  BarChart, 
  Settings, 
  Eye,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Fingerprint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminBalanceManager from '../components/AdminBalanceManager';
import logo from '../assets/palmpay-logo.png';
import { Tabs, Tab } from '@mui/material'; // If not installed, replace with custom tab logic or Tailwind
import { getUsers, assignBalance } from '../api/adminApi';
import { getApplicants } from '../api/applicantsApi';
import { api } from '../api/palmPayApi';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showBalanceManager, setShowBalanceManager] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState('');
  const [sendValueUser, setSendValueUser] = useState('');
  const [sendValueAmount, setSendValueAmount] = useState('');
  const [sendValueLoading, setSendValueLoading] = useState(false);
  const [sendValueError, setSendValueError] = useState('');
  const [sendValueSuccess, setSendValueSuccess] = useState('');
  const navigate = useNavigate();

  // Admin check
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.is_admin !== true) {
      navigate('/user-dashboard');
    }
  }, [navigate]);

  // Fetch users
  useEffect(() => {
    if (tabIndex === 0 || tabIndex === 1) {
      setUsersLoading(true);
      setUsersError('');
      getUsers()
        .then((res) => setUsers(res.data?.users || res.users || []))
        .catch((err) => setUsersError(err.message || 'Failed to load users'))
        .finally(() => setUsersLoading(false));
    }
  }, [tabIndex]);

  // Fetch applicants
  useEffect(() => {
    if (tabIndex === 3) {
      setApplicantsLoading(true);
      setApplicantsError('');
      getApplicants()
        .then((res) => setApplicants(res.data?.applicants || res.applicants || []))
        .catch((err) => setApplicantsError(err.message || 'Failed to load applicants'))
        .finally(() => setApplicantsLoading(false));
    }
  }, [tabIndex]);

  // Fetch transactions
  useEffect(() => {
    if (tabIndex === 2) {
      setTransactionsLoading(true);
      setTransactionsError('');
      api.get('/api/transaction')
        .then((res) => setTransactions(res.data?.transactions || res.transactions || []))
        .catch((err) => setTransactionsError(err.message || 'Failed to load transactions'))
        .finally(() => setTransactionsLoading(false));
    }
  }, [tabIndex]);

  // Send value handler
  const handleSendValue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendValueError('');
    setSendValueSuccess('');
    setSendValueLoading(true);
    try {
      await assignBalance(sendValueUser, Number(sendValueAmount));
      setSendValueSuccess('Value sent successfully!');
      setSendValueUser('');
      setSendValueAmount('');
      // Refresh users
      getUsers().then((res) => setUsers(res.data?.users || res.users || []));
    } catch (err: any) {
      setSendValueError(err.message || 'Failed to send value');
    } finally {
      setSendValueLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    setIsLoggedIn(true);
    
    // Redirect based on role
    if (selectedRole === 'user') {
      navigate('/user-dashboard');
    } else if (selectedRole === 'merchant') {
      navigate('/store-dashboard');
    }
  };

  const stats = [
    {
      icon: Users,
      title: 'Total Users',
      value: '125,847',
      change: '+12.5%',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: CreditCard,
      title: 'Transactions Today',
      value: '₹45,23,890',
      change: '+8.3%',
      color: 'from-fintech-green to-electric-blue'
    },
    {
      icon: Shield,
      title: 'Security Score',
      value: '99.9%',
      change: '+0.1%',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: TrendingUp,
      title: 'Growth Rate',
      value: '23.4%',
      change: '+5.2%',
      color: 'from-orange-400 to-red-400'
    }
  ];

  const recentActivity = [
    {
      type: 'success',
      message: 'New user registration: john@example.com',
      time: '2 minutes ago'
    },
    {
      type: 'warning',
      message: 'High transaction volume detected',
      time: '5 minutes ago'
    },
    {
      type: 'success',
      message: 'Merchant verification completed',
      time: '8 minutes ago'
    },
    {
      type: 'info',
      message: 'System backup completed successfully',
      time: '15 minutes ago'
    }
  ];

  const tabList = [
    { label: 'Users', icon: Users },
    { label: 'Send Value', icon: DollarSign },
    { label: 'Transactions', icon: CreditCard },
    { label: 'Applicants', icon: Hand }
  ];
  // Duplicate tabIndex declaration removed here

  // Add delete API calls
  const deleteUser = async (userId: string) => {
    await api.delete(`/api/auth/users/${userId}`);
  };
  const deleteTransaction = async (txid: string) => {
    await api.delete(`/api/transaction/${txid}`);
  };
  const deleteApplicant = async (applicantId: string) => {
    await api.delete(`/api/applicants/${applicantId}`);
  };

  if (showBalanceManager) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <AdminBalanceManager 
          onSuccess={() => setShowBalanceManager(false)}
        />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-4 animate-pulse-glow">
                <img src={logo} alt="PalmPay Logo" className="h-12 w-auto rounded-full bg-black" />
              </div>
              <h1 className="text-2xl font-ultralight text-white">PalmPay Admin</h1>
              <p className="text-white/70 font-ultralight">Secure access portal</p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-ultralight text-white/70 mb-3">Access Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['admin', 'merchant', 'user'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-4 py-2 rounded-2xl text-sm font-ultralight transition-all duration-300 ${
                      selectedRole === role
                        ? 'bg-gradient-to-r from-fintech-green to-electric-blue text-black'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-ultralight text-white/70 mb-2">Email / Phone</label>
                <input
                  type="text"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm transition-all duration-300 font-ultralight"
                  placeholder="admin@palmpay.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-ultralight text-white/70 mb-2">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-fintech-green/50 backdrop-blur-sm transition-all duration-300 font-ultralight"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300 group animate-glow"
              >
                <Fingerprint className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Login</span>
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/20">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-yellow-400 font-ultralight">
                  Demo Mode: Use any email/password
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="PalmPay Logo" className="h-10 w-10 rounded-full bg-black" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => navigate('/user-dashboard')}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300"
          >
            User Page
          </button>
        </div>
      </section>
      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex border-b border-electric-blue/30 mb-6">
          {tabList.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setTabIndex(idx)}
              className={`flex items-center gap-2 px-6 py-3 text-lg font-medium transition-colors border-b-2 -mb-px ${
                tabIndex === idx
                  ? 'border-electric-blue text-electric-blue bg-white/5'
                  : 'border-transparent text-white/60 hover:text-electric-blue'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="bg-card-bg rounded-xl shadow-xl p-6 min-h-[400px]">
          {tabIndex === 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">All Users</h2>
              {usersLoading ? (
                <div className="text-text-secondary">Loading users...</div>
              ) : usersError ? (
                <div className="text-red-400">{usersError}</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Balance</th>
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3">Created</th>
                      <th className="py-2 px-3">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-3">{u.username}</td>
                        <td className="py-2 px-3">{u.email}</td>
                        <td className="py-2 px-3">{u.balance}</td>
                        <td className="py-2 px-3">{u.role}</td>
                        <td className="py-2 px-3">{u.created_at?.slice(0, 10)}</td>
                        <td className="py-2 px-3">
                          <button
                            className="text-red-400 hover:text-red-600 font-bold"
                            onClick={async () => {
                              if (window.confirm('Delete this user?')) {
                                await deleteUser(u.id);
                                setUsers(users.filter((user: any) => user.id !== u.id));
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {tabIndex === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Send Value</h2>
              <form onSubmit={handleSendValue} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Select User</label>
                  <select
                    value={sendValueUser}
                    onChange={(e) => setSendValueUser(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
                    required
                  >
                    <option value="">-- Select a user --</option>
                    {users.map((u: any) => (
                      <option key={u.id} value={u.id}>{u.username || u.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Amount</label>
                  <input
                    type="number"
                    value={sendValueAmount}
                    onChange={(e) => setSendValueAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium"
                  disabled={sendValueLoading}
                >
                  {sendValueLoading ? 'Sending...' : 'Send Value'}
                </button>
                {sendValueError && <div className="text-red-400 mt-2">{sendValueError}</div>}
                {sendValueSuccess && <div className="text-green-400 mt-2">{sendValueSuccess}</div>}
              </form>
            </div>
          )}
          {tabIndex === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">All Transactions</h2>
              {transactionsLoading ? (
                <div className="text-text-secondary">Loading transactions...</div>
              ) : transactionsError ? (
                <div className="text-red-400">{transactionsError}</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 px-3">From User</th>
                      <th className="py-2 px-3">To Merchant</th>
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Created</th>
                      <th className="py-2 px-3">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t: any) => (
                      <tr key={t.txid} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-3">{t.from_user_id}</td>
                        <td className="py-2 px-3">{t.to_merchant_id}</td>
                        <td className="py-2 px-3">{t.amount}</td>
                        <td className="py-2 px-3">{t.status}</td>
                        <td className="py-2 px-3">{t.created_at?.slice(0, 10)}</td>
                        <td className="py-2 px-3">
                          <button
                            className="text-red-400 hover:text-red-600 font-bold"
                            onClick={async () => {
                              if (window.confirm('Delete this transaction?')) {
                                await deleteTransaction(t.txid);
                                setTransactions(transactions.filter((tx: any) => tx.txid !== t.txid));
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {tabIndex === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Applicants</h2>
              {applicantsLoading ? (
                <div className="text-text-secondary">Loading applicants...</div>
              ) : applicantsError ? (
                <div className="text-red-400">{applicantsError}</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Phone</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3">Created</th>
                      <th className="py-2 px-3">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((a: any) => (
                      <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-3">{a.username}</td>
                        <td className="py-2 px-3">{a.email}</td>
                        <td className="py-2 px-3">{a.phonenumber}</td>
                        <td className="py-2 px-3">{a.description}</td>
                        <td className="py-2 px-3">{a.created_at?.slice(0, 10)}</td>
                        <td className="py-2 px-3">
                          <button
                            className="text-red-400 hover:text-red-600 font-bold"
                            onClick={async () => {
                              if (window.confirm('Delete this applicant?')) {
                                await deleteApplicant(a.id);
                                setApplicants(applicants.filter((app: any) => app.id !== a.id));
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;