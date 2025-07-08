import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Hand, 
  CreditCard, 
  Users, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  Shield,
  TrendingUp
} from 'lucide-react';
import { 
  registerPalm, 
  createTransaction, 
  getDashboard, 
  assignBalance, 
  getMerchantPayments 
} from '../api/palmPayApi';

interface DashboardIntegrationProps {
  onComplete?: () => void;
}

const DashboardIntegration: React.FC<DashboardIntegrationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [demoData, setDemoData] = useState<{
    user: any;
    merchant: any;
    transactions: any[];
  }>({
    user: null,
    merchant: null,
    transactions: []
  });

  const steps = [
    {
      title: 'User Registration',
      description: 'Register user palm and mint consent',
      action: async () => {
        const userData = {
          name: 'Demo User',
          phone: '1234567890',
          hash: 'palm_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
        };
        
        try {
          const result = await registerPalm(userData);
          setDemoData(prev => ({ ...prev, user: result.user }));
          return result;
        } catch (err: any) {
          throw new Error('Registration failed: ' + err.message);
        }
      }
    },
    {
      title: 'Assign Balance',
      description: 'Admin assigns balance to user',
      action: async () => {
        if (!demoData.user) throw new Error('User not registered');
        
        try {
          const result = await assignBalance({
            type: 'user',
            id: demoData.user.id,
            balance: 10000
          });
          setDemoData(prev => ({ 
            ...prev, 
            user: { ...prev.user, balance: 10000 }
          }));
          return result;
        } catch (err: any) {
          throw new Error('Balance assignment failed: ' + err.message);
        }
      }
    },
    {
      title: 'Create Merchant',
      description: 'Setup merchant account',
      action: async () => {
        try {
          const result = await assignBalance({
            type: 'merchant',
            id: 'demo-merchant-id',
            balance: 0
          });
          setDemoData(prev => ({ ...prev, merchant: result.merchant }));
          return result;
        } catch (err: any) {
          throw new Error('Merchant setup failed: ' + err.message);
        }
      }
    },
    {
      title: 'Process Transaction',
      description: 'Merchant processes palm payment',
      action: async () => {
        if (!demoData.user) throw new Error('User not registered');
        
        const transactionData = {
          userPhone: demoData.user.phone,
          merchantId: 'demo-merchant-id',
          amount: 500,
          hash: demoData.user.hash
        };
        
        try {
          const result = await createTransaction(transactionData);
          setDemoData(prev => ({ 
            ...prev, 
            transactions: [...prev.transactions, result]
          }));
          return result;
        } catch (err: any) {
          throw new Error('Transaction failed: ' + err.message);
        }
      }
    },
    {
      title: 'View Dashboard',
      description: 'Check updated balances and history',
      action: async () => {
        try {
          const userDashboard = await getDashboard(demoData.user?.id || 'demo-user-id');
          const merchantPayments = await getMerchantPayments('demo-merchant-id');
          setDemoData(prev => ({ 
            ...prev, 
            user: userDashboard.user,
            merchant: merchantPayments.merchant,
            transactions: userDashboard.transactions
          }));
          return { userDashboard, merchantPayments };
        } catch (err: any) {
          throw new Error('Dashboard load failed: ' + err.message);
        }
      }
    }
  ];

  const runStep = async (stepIndex: number) => {
    if (stepIndex >= steps.length) {
      setSuccess(true);
      if (onComplete) onComplete();
      return;
    }

    setLoading(true);
    setError('');

    try {
      await steps[stepIndex].action();
      setCurrentStep(stepIndex + 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runAllSteps = async () => {
    for (let i = 0; i < steps.length; i++) {
      await runStep(i);
      if (error) break;
      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-3xl bg-gradient-to-br from-fintech-green/20 to-electric-blue/20 border border-fintech-green/30 backdrop-blur-xl text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fintech-green mb-4">
          <CheckCircle className="w-8 h-8 text-black" />
        </div>
        <h3 className="text-xl font-ultralight text-white mb-2">Integration Complete!</h3>
        <p className="text-white/70 font-ultralight mb-6">
          All PalmPay features are now connected and working.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white/10">
            <h4 className="text-fintech-green font-ultralight mb-2">User Balance</h4>
            <p className="text-white font-ultralight">₹{demoData.user?.balance?.toLocaleString() || '0'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10">
            <h4 className="text-electric-blue font-ultralight mb-2">Merchant Balance</h4>
            <p className="text-white font-ultralight">₹{demoData.merchant?.balance?.toLocaleString() || '0'}</p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300"
        >
          Start Over
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-4 animate-pulse-glow">
          <Shield className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-2xl font-ultralight text-white mb-2">PalmPay Integration Demo</h2>
        <p className="text-white/70 font-ultralight">
          Complete end-to-end integration test
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl transition-all duration-300 ${
              index < currentStep
                ? 'bg-fintech-green/20 border border-fintech-green/30'
                : index === currentStep
                ? 'bg-electric-blue/20 border border-electric-blue/30'
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  index < currentStep
                    ? 'bg-fintech-green'
                    : index === currentStep
                    ? 'bg-electric-blue'
                    : 'bg-white/10'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4 text-black" />
                  ) : (
                    <span className="text-white font-ultralight text-sm">{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-ultralight">{step.title}</h3>
                  <p className="text-white/50 font-ultralight text-sm">{step.description}</p>
                </div>
              </div>
              {index === currentStep && loading && (
                <Loader2 className="w-5 h-5 text-electric-blue animate-spin" />
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-400/10 border border-red-400/20 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-ultralight">{error}</span>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => runStep(currentStep)}
          disabled={loading}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5" />
              <span>Next Step</span>
            </>
          )}
        </button>
        
        <button
          onClick={runAllSteps}
          disabled={loading}
          className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 hover:border-fintech-green/50 transition-all duration-300 font-ultralight disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Run All
        </button>
      </div>
    </motion.div>
  );
};

export default DashboardIntegration; 