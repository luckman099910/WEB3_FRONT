import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Gift, 
  Crown, 
  Diamond, 
  Coffee, 
  Plane, 
  ShoppingBag, 
  Users,
  ArrowRight,
  Share2,
  Copy,
  Coins
} from 'lucide-react';

const RewardsPage = () => {
  const tiers = [
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
      color: 'from-fintech-green to-electric-blue',
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

  const rewardOptions = [
    {
      icon: Coffee,
      title: 'Food & Dining',
      description: 'Redeem at restaurants, cafes, and food delivery',
      points: '500 - 2,000 PalmPoints',
      color: 'from-amber-400 to-orange-400'
    },
    {
      icon: ShoppingBag,
      title: 'Shopping',
      description: 'Discounts at partner retailers and online stores',
      points: '1,000 - 5,000 PalmPoints',
      color: 'from-pink-400 to-red-400'
    },
    {
      icon: Plane,
      title: 'Travel',
      description: 'Flight upgrades, hotel stays, and travel vouchers',
      points: '2,000 - 10,000 PalmPoints',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Gift,
      title: 'Cashback',
      description: 'Direct cashback to your INR wallet',
      points: '100+ PalmPoints',
      color: 'from-fintech-green to-electric-blue'
    }
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-ultralight text-white mb-6">
              Earn
              <br />
              <span className="bg-gradient-to-r from-fintech-green to-electric-blue bg-clip-text text-transparent">
                PalmPoints
              </span>
            </h1>
            <p className="text-xl text-white/70 font-ultralight max-w-3xl mx-auto">
              Get rewarded for every payment you make. Unlock exclusive benefits, 
              premium services, and amazing experiences with our loyalty program.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PalmPoints Overview */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-ultralight text-white mb-4">
              PalmPoints System
            </h2>
            <p className="text-xl text-white/70 font-ultralight max-w-2xl mx-auto">
              Earn 5–20 points per scan and redeem for gift cards, cashback, and exclusive offers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewardOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-fintech-green/30 transition-all duration-300 hover:scale-105"
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${option.color} bg-opacity-20 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-ultralight text-white mb-2">{option.title}</h3>
                <p className="text-white/70 font-ultralight text-sm mb-3">{option.description}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-fintech-green/20 border border-fintech-green/30">
                  <span className="text-xs text-fintech-green font-ultralight">{option.points}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PalmStars Tier System */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-ultralight text-white mb-4">
              PalmStars Tier Ladder
            </h2>
            <p className="text-xl text-white/70 font-ultralight max-w-2xl mx-auto">
              The more you use PalmPay, the more rewards you earn. 
              Progress through our tier system for exclusive benefits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${tier.color} bg-opacity-10 border border-white/10 hover:border-opacity-30 transition-all duration-300 group ${
                  index === 1 ? 'scale-105 border-fintech-green/30' : ''
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${tier.color} bg-opacity-20 mb-4 group-hover:scale-110 transition-transform`}>
                    <tier.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-ultralight text-white mb-2">{tier.name}</h3>
                  <p className="text-white/70 font-ultralight text-sm">{tier.requirement}</p>
                </div>

                <div className="space-y-3">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tier.color}`} />
                      <span className="text-white/80 font-ultralight text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Tracker */}
      <section className="py-20 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-fintech-green/10 to-electric-blue/10 border border-fintech-green/20 backdrop-blur-xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-ultralight text-white mb-4">Your Progress</h2>
              <p className="text-white/70 font-ultralight">
                Track your PalmPoints and see how close you are to the next tier.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-white font-ultralight">Current Tier: Gold</span>
                <span className="text-fintech-green font-ultralight">7,543 PalmPoints</span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-fintech-green to-electric-blue h-3 rounded-full transition-all duration-1000"
                    style={{ width: '75%' }}
                  />
                </div>
                <div className="absolute top-5 left-3/4 transform -translate-x-1/2">
                  <div className="px-3 py-1 rounded-full bg-purple-400/20 border border-purple-400/30">
                    <span className="text-xs text-purple-400 font-ultralight">Platinum: ₹10,000</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/70 font-ultralight">
                  <span className="text-white">₹2,457</span> more spending until Platinum tier
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Referral Program */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-ultralight text-white mb-6">
                Refer & Earn
              </h2>
              <p className="text-xl text-white/70 font-ultralight mb-8">
                Invite friends to PalmPay and earn bonus PalmPoints for every successful referral.
                Both you and your friend get rewarded!
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue flex items-center justify-center text-black font-medium text-sm">
                    1
                  </div>
                  <span className="text-white font-ultralight">Share your unique referral link</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue flex items-center justify-center text-black font-medium text-sm">
                    2
                  </div>
                  <span className="text-white font-ultralight">Friend signs up and makes first payment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue flex items-center justify-center text-black font-medium text-sm">
                    3
                  </div>
                  <span className="text-white font-ultralight">Both earn 100 bonus PalmPoints</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300 group animate-glow">
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Share Link</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 hover:border-fintech-green/50 transition-all duration-300">
                  <Copy className="w-5 h-5" />
                  <span>Copy Link</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-400/10 to-pink-400/10 border border-purple-400/20 backdrop-blur-xl">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mb-6">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-ultralight text-white mb-4">Your Referral Progress</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 rounded-2xl bg-white/5">
                      <p className="text-3xl font-ultralight text-white mb-1">12</p>
                      <p className="text-white/70 font-ultralight text-sm">Successful Referrals</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-white/5">
                      <p className="text-3xl font-ultralight text-fintech-green mb-1">1,200</p>
                      <p className="text-white/70 font-ultralight text-sm">Bonus Points Earned</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/20 mb-4">
                    <span className="text-lg font-mono text-fintech-green">PALM2024</span>
                  </div>
                  <p className="text-white/50 font-ultralight text-xs">
                    Your unique referral code
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
            className="p-8 rounded-3xl bg-gradient-to-br from-fintech-green/10 to-electric-blue/10 border border-fintech-green/20 backdrop-blur-xl"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fintech-green to-electric-blue mb-6">
              <Coins className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-3xl md:text-4xl font-ultralight text-white mb-4">
              Start Earning Today
            </h2>
            <p className="text-xl text-white/70 font-ultralight mb-8">
              Join thousands of users already earning PalmPoints with every payment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center space-x-2 px-8 py-4 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300 group animate-glow">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/5 hover:border-fintech-green/50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RewardsPage;