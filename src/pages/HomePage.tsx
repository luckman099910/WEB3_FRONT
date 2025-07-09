import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, Users, CheckCircle, Hand, Fingerprint, Coins, Link as LinkIcon, Smartphone, Star, Quote, MapPin, Search, Building, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      icon: Fingerprint,
      title: 'Biometric Identity',
      description: 'Your palm is your password. No cards. No devices. Just you.'
    },
    {
      icon: Coins,
      title: 'INR Wallet',
      description: 'Direct wallet deduction in INR. No OTP. No apps required.'
    },
    {
      icon: LinkIcon,
      title: 'Blockchain Verified',
      description: 'Every payment and consent stored transparently on-chain.'
    },
  ];

  const howItWorks = [
    {
      icon: Hand,
      step: '01',
      title: 'Palm Scan (Infrared)',
      description: 'We capture your palm geometry using advanced infrared scanning technology.'
    },
    {
      icon: Shield,
      step: '02',
      title: 'Geometric Hashing',
      description: 'The palmprint is converted into a non-reversible cryptographic hash.'
    },
    {
      icon: CheckCircle,
      step: '03',
      title: 'Consent Stored (Blockchain)',
      description: 'Your biometric consent is permanently logged via smart contract.'
    },
    {
      icon: Coins,
      step: '04',
      title: 'INR Wallet Deduction',
      description: 'Payment is executed from your wallet to the merchant instantly.'
    },
    {
      icon: LinkIcon,
      step: '05',
      title: 'Transaction Minted On-Chain',
      description: 'All transaction details are permanently recorded on blockchain.'
    }
  ];

  const featuresPreview = [
    { name: 'PalmScan™', icon: Hand },
    { name: 'Consent Registry', icon: Shield },
    { name: 'Palm2QR', icon: Smartphone, badge: 'Coming Soon' },
    { name: 'Offline Mode', icon: Zap }
  ];

  const testimonials = [
    {
      quote: "I use PalmPay for chai daily. No mobile needed!",
      author: "Aisha",
      role: "Student"
    },
    {
      quote: "My store became fully digital in 2 days.",
      author: "Rajesh",
      role: "Shopkeeper"
    }
  ];

  const patentClaims = [
    'Biometric Hashing',
    'On-chain Consent',
    'Bluetooth POS Integration',
    'Palm2QR Offline Mode',
    'PalmKiosk Infrastructure'
  ];

  return (
    <div className="bg-tech-blue">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Patent Pending Seal */}
              <div className="inline-flex items-center justify-center">
                <div className="relative">
                  <div className="patent-seal w-32 h-32 rounded-full flex flex-col items-center justify-center text-center animate-pulse-glow">
                    <Award className="w-8 h-8 text-tech-blue mb-1" />
                    <div className="text-tech-blue font-normal text-sm leading-tight">
                      <div className="font-medium">PATENT</div>
                      <div className="font-medium">PENDING</div>
                      <div className="text-xs mt-1">12+ Claims Filed</div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-neon-green to-sky-blue rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-4 h-4 text-tech-blue" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
                Your Palm.
                <br />
                <span className="bg-gradient-to-r from-neon-green to-sky-blue bg-clip-text text-transparent text-glow">
                  Your Wallet.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto">
                The most advanced way to pay — just scan your palm.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/demo"
                  className="flex items-center space-x-2 px-8 py-4 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-tech-blue font-normal hover:neon-glow transition-all duration-300 group animate-glow"
                >
                  <span>Try Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/applicants-register"
                  className="flex items-center space-x-2 px-8 py-4 rounded-full glass-effect text-white hover:bg-white/10 hover:border-neon-green/50 transition-all duration-300"
                >
                  <span>Join Waitlist</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-blue/10 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>
      </section>

      {/* Why PalmPay Section */}
      <section className="py-8 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Why Choose PalmPay?
            </h2>
            <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
              The most secure, convenient, and transparent payment method ever created.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-3xl glass-effect hover:border-neon-green/30 transition-all duration-300 group hover:scale-105"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-neon-green/20 to-sky-blue/20 w-fit mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="text-xl font-light text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              How PalmPay Works — The Technology Behind the Touch
            </h2>
            <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
              Five secure steps to the future of payments.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group p-6 rounded-3xl glass-effect hover:border-neon-green/30 transition-all duration-300"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-neon-green/20 to-sky-blue/20 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-neon-green" />
                </div>
                <div className="text-2xl font-light text-neon-green mb-4 text-glow">{step.step}</div>
                <h3 className="text-lg font-light text-white mb-3">{step.title}</h3>
                <p className="text-white/70 font-light text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-8 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Features Preview
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresPreview.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-6 rounded-2xl glass-effect hover:border-neon-green/30 transition-all duration-300 group text-center"
              >
                {feature.badge && (
                  <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-sky-blue text-tech-blue text-xs font-normal">
                    {feature.badge}
                  </div>
                )}
                <div className="p-3 rounded-xl bg-gradient-to-br from-neon-green/20 to-sky-blue/20 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-lg font-light text-white">{feature.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              What People Say
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-8 rounded-3xl glass-effect hover:border-neon-green/30 transition-all duration-300"
              >
                <Quote className="w-8 h-8 text-neon-green mb-4" />
                <p className="text-white font-light text-lg mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-sky-blue"></div>
                  <div>
                    <p className="text-white font-light">{testimonial.author}</p>
                    <p className="text-white/70 font-light text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patent Block */}
      <section className="py-8 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-neon-green/10 to-sky-blue/10 border border-neon-green/20 glass-effect text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-sky-blue mb-6">
              <Shield className="w-8 h-8 text-tech-blue" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Patent Pending Technology
            </h2>
            <p className="text-xl text-white/70 font-light mb-8 max-w-3xl mx-auto">
              PalmPay™ is Patent Pending with 12+ claims filed with the Indian Patent Office for biometric payment innovation:
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {patentClaims.map((claim, index) => (
                <div key={index} className="px-4 py-2 rounded-full glass-effect border border-neon-green/30">
                  <span className="text-neon-green font-light text-sm text-glow">{claim}</span>
                </div>
              ))}
            </div>
            <Link
              to="/technology"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-tech-blue font-normal hover:neon-glow transition-all duration-300 group"
            >
              <span>Explore Our Technology</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PalmKiosk & PalmPOS Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Scan Anywhere with PalmKiosk™
            </h2>
            <p className="text-xl text-white/70 font-light max-w-3xl mx-auto">
              We're launching PalmKiosk™ stations across India to enable anyone to register using just their palm, 
              receive instant INR wallet activation, and earn bonus PalmPoints.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl glass-effect">
                <h3 className="text-2xl font-light text-white mb-4">PalmKiosk™ Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Kiosks across India for palm registration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Liveness check & consent activation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Works offline with sync capability</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl glass-effect">
                <h3 className="text-2xl font-light text-white mb-4">PalmPOS™ Integration</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Bluetooth SDK for existing POS (Razorpay, Pine Labs)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Offline Buffer Mode for remote areas</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Future: PalmPOS™ with Android OS</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="p-8 rounded-3xl bg-gradient-to-br from-neon-green/10 to-sky-blue/10 border border-neon-green/20 glass-effect text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-sky-blue mb-6">
                  <Star className="w-10 h-10 text-tech-blue" />
                </div>
                <h3 className="text-2xl font-light text-white mb-4">Bonus Offer</h3>
                <p className="text-neon-green font-light text-lg mb-6 text-glow">
                  Register at any PalmKiosk and earn 100 PalmPoints
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center justify-center space-x-2 px-6 py-4 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-tech-blue font-normal hover:neon-glow transition-all duration-300 group">
                  <MapPin className="w-5 h-5" />
                  <span>Locate PalmKiosk</span>
                </button>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    className="flex-1 px-4 py-3 rounded-full glass-effect text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 font-light"
                  />
                  <button className="px-6 py-3 rounded-full border border-neon-green/50 text-neon-green hover:bg-neon-green/10 transition-all duration-300">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                <button className="flex items-center justify-center space-x-2 px-6 py-4 rounded-full glass-effect text-white hover:bg-white/10 hover:border-neon-green/50 transition-all duration-300">
                  <Building className="w-5 h-5" />
                  <span>Partner with PalmPOS</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join the Movement Section */}
      <section className="py-8 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-neon-green/10 to-sky-blue/10 border border-neon-green/20 glass-effect"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Join the Movement
            </h2>
            <p className="text-xl text-white/70 font-light mb-8">
              Join thousands of early adopters and be first to experience palm-based payments.
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 rounded-full glass-effect text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 font-light"
              />
              <input
                type="email"
                placeholder="Email/Phone"
                className="w-full px-4 py-3 rounded-full glass-effect text-white placeholder-white/50 focus:outline-none focus:border-neon-green/50 font-light"
              />
              <select className="w-full px-4 py-3 rounded-full glass-effect text-white focus:outline-none focus:border-neon-green/50 font-light">
                <option value="">Are you a User or Merchant?</option>
                <option value="user">User</option>
                <option value="merchant">Merchant</option>
              </select>
              <button className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-tech-blue font-normal hover:neon-glow transition-all duration-300 animate-glow">
                Join Early Access
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-neon-green to-sky-blue">
                <Hand className="w-6 h-6 text-tech-blue" />
              </div>
              <span className="text-xl font-light text-white">PalmPay™</span>
            </div>
            <p className="text-neon-green font-light mb-6 text-glow">The Wallet in Your Hand</p>
            
            {/* Patent Pending Footer */}
            <div className="mb-8 p-4 rounded-2xl glass-effect border border-neon-green/30 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-neon-green" />
                <span className="text-neon-green font-normal text-glow">Patent Pending</span>
              </div>
              <p className="text-white/70 font-light text-sm">12+ Claims Filed for Biometric Payment Innovation</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <button className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">Locate PalmKiosk™</button>
              <button className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">Partner with PalmPOS™</button>
              <button className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">PalmStars</button>
              <button className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">PalmPoints</button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <Link to="/" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">Home</Link>
              <Link to="/features" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">Features</Link>
              <Link to="/demo" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">Demo</Link>
              <Link to="/technology" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">Technology</Link>
              <Link to="/contact" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">About / Contact</Link>
              <a href="#" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">Privacy</a>
              <a href="#" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors font-light">Terms</a>
            </div>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="#" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="text-white/70 hover:text-neon-green hover:text-glow transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
            <p className="text-white/50 font-light text-sm">© 2025 Auronix Hive Innovations Pvt. Ltd.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;