import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  CreditCard, 
  Smartphone, 
  Clock, 
  TrendingUp,
  Gift,
  Settings,
  Bell,
  BarChart,
  Hand,
  Coins,
  Link as LinkIcon,
  Star,
  Crown,
  Diamond,
  Coffee,
  Plane,
  ShoppingBag,
  ArrowRight,
  Share2,
  Copy,
  CheckCircle,
  Lightbulb,
  Wifi,
  WifiOff
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: Hand,
      title: 'PalmScan™',
      description: 'Front camera biometric authentication with liveness detection',
      color: 'from-neon-green to-neon-aqua',
      id: 'palm-scan',
      comingSoon: false
    },
    {
      icon: Coins,
      title: 'INR Wallets',
      description: 'Direct INR wallet for users and merchants with instant transfers',
      color: 'from-green-400 to-cyan-400',
      id: 'inr-wallets',
      comingSoon: false
    },
    {
      icon: Smartphone,
      title: 'Palm2QR',
      description: 'Hybrid mode combining palm scan with QR code generation',
      color: 'from-blue-400 to-purple-400',
      id: 'palm2qr',
      comingSoon: false
    },
    {
      icon: WifiOff,
      title: 'Offline Buffer Mode',
      description: 'Process payments offline and sync when connection returns',
      color: 'from-yellow-400 to-orange-400',
      id: 'offline-buffer-mode',
      comingSoon: true
    },
    {
      icon: CreditCard,
      title: 'Utility Bill Pay',
      description: 'Pay electricity, water, gas bills directly through palm scan',
      color: 'from-teal-400 to-cyan-400',
      id: 'utility-bill-pay',
      comingSoon: true
    },
    {
      icon: Bell,
      title: 'SIM-Linked Login',
      description: 'Secure authentication linked to your mobile SIM card',
      color: 'from-indigo-400 to-purple-400',
      id: 'sim-linked-login',
      comingSoon: true
    },
    {
      icon: Gift,
      title: 'PalmPoints',
      description: 'Earn 5-20 points per scan, redeem for rewards and cashback',
      color: 'from-purple-400 to-pink-400',
      id: 'palmpoints',
      comingSoon: false
    },
    {
      icon: TrendingUp,
      title: 'PalmStars Tiers',
      description: 'Silver, Gold, Platinum tiers with increasing benefits',
      color: 'from-orange-400 to-red-400',
      id: 'palmstars-tiers',
      comingSoon: false
    },
    {
      icon: Shield,
      title: 'Consent Logging',
      description: 'Blockchain-based consent management with full user control',
      color: 'from-gray-400 to-slate-400',
      id: 'consent-logging',
      comingSoon: false
    },
    {
      icon: Globe,
      title: 'UPI Integration',
      description: 'Seamless integration with existing UPI payment systems',
      color: 'from-neon-green to-neon-aqua',
      id: 'upi-integration',
      comingSoon: true
    }
  ];

  const rewardTiers = [
    {
      name: 'Silver',
      icon: Star,
      color: 'from-gray-400 to-gray-600',
      requirement: '₹2,000 spend',
      benefits: [
        '5 PalmPoints per scan',
        'Basic transaction insights',
        'Email support',
        'Standard processing'
      ]
    },
    {
      name: 'Gold',
      icon: Crown,
      color: 'from-neon-green to-neon-aqua',
      requirement: '₹5,000 spend',
      benefits: [
        '10 PalmPoints per scan',
        'Advanced analytics',
        'Priority support',
        'Exclusive offers',
        'Faster processing'
      ]
    },
    {
      name: 'Platinum',
      icon: Diamond,
      color: 'from-purple-400 to-pink-400',
      requirement: '₹10,000 spend',
      benefits: [
        '20 PalmPoints per scan',
        'Premium insights',
        'Dedicated support',
        'VIP access',
        'Instant processing',
        'Concierge services'
      ]
    }
  ];

  const utilityServices = [
    {
      icon: Lightbulb,
      title: 'Electricity Bills',
      description: 'Pay your electricity bills instantly with palm scan',
      providers: ['BESCOM', 'MSEB', 'TNEB', 'KSEB']
    },
    {
      icon: Smartphone,
      title: 'Mobile Recharge',
      description: 'Recharge your mobile instantly across all networks',
      providers: ['Airtel', 'Jio', 'Vi', 'BSNL']
    },
    {
      icon: Shield,
      title: 'Insurance Premiums',
      description: 'Pay insurance premiums with biometric verification',
      providers: ['LIC', 'HDFC Life', 'ICICI Prudential', 'SBI Life']
    },
    {
      icon: CreditCard,
      title: 'Credit Card Bills',
      description: 'Pay credit card bills from any bank instantly',
      providers: ['HDFC', 'ICICI', 'SBI', 'Axis']
    }
  ];

  const partnerIntegrations = [
    {
      name: 'Razorpay POS',
      description: 'Bluetooth SDK integration with existing Razorpay terminals',
      status: 'Available'
    },
    {
      name: 'Pine Labs',
      description: 'Direct integration with Pine Labs payment terminals',
      status: 'Available'
    },
    {
      name: 'Paytm POS',
      description: 'SDK integration for Paytm merchant terminals',
      status: 'Coming Soon'
    },
    {
      name: 'PalmPOS™ Device',
      description: 'Dedicated Android-based POS with built-in palm scanner',
      status: 'Development'
    }
  ];

  return (
    <div className="bg-tech-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-light text-primary mb-6">
              Powerful
              <br />
              <span className="bg-gradient-to-r from-neon-green to-neon-aqua bg-clip-text text-transparent text-glow">
                Features
              </span>
            </h1>
            <p className="text-xl text-text-secondary font-light max-w-3xl mx-auto">
              Everything you need for secure, convenient, and rewarding payments.
              Built for individuals, businesses, and the future of finance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => {
                  const el = document.getElementById(feature.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300 hover:scale-105 text-left w-full"
                style={{ cursor: 'pointer' }}
              >
                {feature.comingSoon && (
                  <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-neon-aqua text-tech-black text-xs font-normal shadow-lg">
                    Coming Soon
                  </div>
                )}
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-20 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-light text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary font-light text-sm">{feature.description}</p>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-green/10 to-neon-aqua/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Add detailed sections for each feature below: */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {features.map((feature, idx) => (
            <div key={feature.id} id={feature.id} className="rounded-3xl glass-card p-8 mb-8 scroll-mt-24">
              <div className="flex items-center gap-4 mb-4">
                <feature.icon className="w-8 h-8 text-neon-green" />
                <h2 className="text-2xl font-bold text-primary">{feature.title}</h2>
                {feature.comingSoon && (
                  <span className="ml-4 px-3 py-1 rounded-full bg-neon-aqua text-tech-black text-xs font-normal shadow-lg">Coming Soon</span>
                )}
              </div>
              <p className="text-text-secondary text-lg mb-2">{feature.description}</p>
              {/* Add more detailed content for each feature here as needed */}
              <div className="text-white/70 font-light text-sm">Detailed explanation for {feature.title} goes here. You can expand this section with more info, images, or links as needed.</div>
            </div>
          ))}
        </div>
      </section>

      {/* PalmStars Tier System */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              PalmStars Tier System
            </h2>
            <p className="text-xl text-text-secondary font-light max-w-2xl mx-auto">
              The more you use PalmPay, the more rewards you earn. 
              Progress through our tier system for exclusive benefits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {rewardTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${tier.color} bg-opacity-10 glass-card hover:border-opacity-30 transition-all duration-300 group ${
                  index === 1 ? 'scale-105 border-neon-green/30' : ''
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-green to-neon-aqua text-tech-black text-sm font-normal">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${tier.color} bg-opacity-20 mb-4 group-hover:scale-110 transition-transform`}>
                    <tier.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-light text-primary mb-2">{tier.name}</h3>
                  <p className="text-text-secondary font-light text-sm">{tier.requirement}</p>
                </div>

                <div className="space-y-3">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tier.color}`} />
                      <span className="text-text-secondary font-light text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Utility Payments */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              Utility Payments
            </h2>
            <p className="text-xl text-text-secondary font-light max-w-2xl mx-auto">
              Pay all your bills with just a palm scan. No apps, no cards, no hassle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {utilityServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300 group"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-aqua/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="text-lg font-light text-primary mb-2">{service.title}</h3>
                <p className="text-text-secondary font-light text-sm mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.providers.map((provider, providerIndex) => (
                    <span key={providerIndex} className="px-2 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs font-light">
                      {provider}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Integrations */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              PalmPOS™ & Partner Integrations
            </h2>
            <p className="text-xl text-text-secondary font-light max-w-2xl mx-auto">
              Seamless integration with existing POS systems and dedicated PalmPOS™ devices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnerIntegrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-light text-primary">{integration.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-light ${
                    integration.status === 'Available' 
                      ? 'bg-neon-green/20 text-neon-green' 
                      : integration.status === 'Coming Soon'
                      ? 'bg-neon-aqua/20 text-neon-aqua'
                      : 'bg-yellow-400/20 text-yellow-400'
                  }`}>
                    {integration.status}
                  </span>
                </div>
                <p className="text-text-secondary font-light">{integration.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline Mode */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-light text-primary mb-6">
                Offline Buffer Mode
              </h2>
              <p className="text-xl text-text-secondary font-light mb-8">
                Never miss a payment, even without internet. Our offline buffer mode 
                processes transactions locally and syncs when connectivity returns.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-neon-green" />
                  <span className="text-primary font-light">Process payments without internet</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-neon-green" />
                  <span className="text-primary font-light">Automatic sync when online</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-neon-green" />
                  <span className="text-primary font-light">Secure local storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-neon-green" />
                  <span className="text-primary font-light">Perfect for remote areas</span>
                </div>
              </div>

              <button className="btn-primary px-8 py-4 rounded-full flex items-center space-x-2">
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="p-8 rounded-3xl glass-card">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-neon-green to-neon-aqua mb-6 animate-pulse-glow">
                    <WifiOff className="w-12 h-12 text-tech-black" />
                  </div>
                  <h3 className="text-2xl font-light text-primary mb-4">Offline Mode Active</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 rounded-2xl glass-effect">
                      <p className="text-3xl font-light text-primary mb-1">47</p>
                      <p className="text-text-secondary font-light text-sm">Pending Transactions</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl glass-effect">
                      <p className="text-3xl font-light text-neon-green mb-1">₹12,450</p>
                      <p className="text-text-secondary font-light text-sm">Total Value</p>
                    </div>
                  </div>
                  <p className="text-text-secondary font-light text-sm">
                    Transactions will sync automatically when connection is restored
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-neon-green/10 to-neon-aqua/10 border border-neon-green/20 glass-card"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              Experience All Features
            </h2>
            <p className="text-xl text-text-secondary font-light mb-8">
              Join thousands of users already enjoying the complete PalmPay experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-4 rounded-full flex items-center space-x-2">
                <span>Try Demo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn-secondary px-8 py-4 rounded-full">
                Join Waitlist
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;