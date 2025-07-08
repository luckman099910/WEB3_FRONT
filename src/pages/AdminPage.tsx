import React, { useState } from 'react';
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

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showBalanceManager, setShowBalanceManager] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-ultralight text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-white/70 font-ultralight">
                Monitor and manage PalmPay operations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300">
                <Settings className="w-6 h-6 text-white" />
              </button>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 font-ultralight"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-fintech-green/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-fintech-green font-ultralight">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-ultralight text-white mb-1">{stat.value}</h3>
                <p className="text-white/70 font-ultralight text-sm">{stat.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h2 className="text-xl font-ultralight text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'success' ? 'bg-fintech-green/20' :
                      activity.type === 'warning' ? 'bg-yellow-400/20' :
                      'bg-blue-400/20'
                    }`}>
                      {activity.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-fintech-green" />
                      ) : activity.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-ultralight text-sm">{activity.message}</p>
                      <p className="text-white/50 font-ultralight text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <h2 className="text-xl font-ultralight text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {[
                  { 
                    icon: DollarSign, 
                    title: 'Assign Balance', 
                    color: 'from-fintech-green to-electric-blue',
                    action: () => setShowBalanceManager(true)
                  },
                  { icon: Users, title: 'User Management', color: 'from-blue-400 to-cyan-400' },
                  { icon: CreditCard, title: 'Transactions', color: 'from-purple-400 to-pink-400' },
                  { icon: Shield, title: 'Security', color: 'from-orange-400 to-red-400' }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-center space-x-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${action.color} bg-opacity-20 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-ultralight">{action.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;