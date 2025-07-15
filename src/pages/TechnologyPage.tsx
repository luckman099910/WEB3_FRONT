import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Cpu, Fingerprint, ChevronDown, ChevronUp, CheckCircle, MapPin, Building, Smartphone, Award, Zap, Globe, Users } from 'lucide-react';
import PosSpecsModal from '../components/PosSpecsModal';
import HostKioskModal from '../components/HostKioskModal';
import LocateKioskModal from '../components/LocateKioskModal';

const TechnologyPage = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showHost, setShowHost] = useState(false);
  const [showLocate, setShowLocate] = useState(false);

  const techFeatures = [
    {
      icon: Fingerprint,
      title: 'Biometric Recognition',
      description: 'Advanced palm vein and print pattern analysis with 99.9% accuracy',
      details: 'Our proprietary algorithm captures over 500 unique data points from your palm, including vein patterns, ridge formations, and geometric measurements.'
    },
    {
      icon: Shield,
      title: 'Quantum Encryption',
      description: 'Military-grade encryption with quantum-resistant algorithms',
      details: 'We use post-quantum cryptography to ensure your biometric data remains secure even against future quantum computing threats.'
    },
    {
      icon: Database,
      title: 'Zero-Knowledge Storage',
      description: 'Your biometric data is never stored in its original form',
      details: 'We only store irreversible mathematical hashes of your biometric data, making it impossible to reconstruct your original palm print.'
    },
    {
      icon: Cpu,
      title: 'Edge Processing',
      description: 'Real-time processing at the point of sale for instant verification',
      details: 'All biometric processing happens locally on our secure hardware, ensuring sub-second transaction times.'
    }
  ];

  const goals = [
    'Eliminate fraud through palm-based hashing',
    'Enable device-less INR payments',
    'Build India\'s most secure on-chain consent engine'
  ];

  const securityFeatures = [
    'No raw biometric stored',
    'Triple hashing model',
    'Publicly verifiable transactions',
    'RBI/UPI roadmap ready'
  ];

  const techStack = [
    { title: 'Frontend', tech: 'React / TypeScript' },
    { title: 'Backend', tech: 'Node.js / PHP' },
    { title: 'Blockchain', tech: 'Celo Mainnet' },
    { title: 'Biometrics', tech: 'Palm + Face Fusion (Coming)' }
  ];

  const patentClaims = [
    'Palm Hashing Architecture',
    'Consent-logged Payments',
    'Bluetooth POS SDK',
    'Palm-to-QR Hybrid',
    'Offline Buffer Mode',
    'Biometric Kiosk Infrastructure'
  ];

  const faqItems = [
    {
      question: 'Do you store my biometric data?',
      answer: 'No, we never store your actual palm print. Only an irreversible mathematical hash is stored, making it impossible to reconstruct your original biometric data. Even if our systems were compromised, your biometric data would remain secure.'
    },
    {
      question: 'How secure is this?',
      answer: 'Our system uses military-grade quantum-resistant encryption, triple hashing models, and blockchain verification. Your biometric data is processed using advanced cryptographic algorithms that create unique hashes impossible to reverse-engineer.'
    },
    {
      question: 'Is this like Face ID?',
      answer: 'While both use biometrics, PalmPay is more secure. We use palm vein patterns and geometry which are internal features that cannot be easily replicated, unlike facial features which can be photographed.'
    },
    {
      question: 'Can merchants misuse it?',
      answer: 'No. Merchants never see your biometric data - only transaction confirmations. All consent is logged on blockchain, giving you complete transparency and control over your data usage.'
    },
    {
      question: 'How does consent management work?',
      answer: 'You have complete control over your biometric data through our blockchain-based consent registry. You can revoke consent at any time, and all associated data will be permanently deleted with full audit trail.'
    },
    {
      question: 'What happens if I injure my palm?',
      answer: 'Our system analyzes multiple areas of your palm and can adapt to minor injuries. You can register both palms for backup authentication, and our liveness detection works even with temporary changes.'
    },
    {
      question: 'Can my palm print be replicated or spoofed?',
      answer: 'Our system uses liveness detection technology that analyzes blood flow patterns in your palm veins. This makes it virtually impossible to spoof with artificial materials or replicas.'
    },
    {
      question: 'How does this integrate with UPI?',
      answer: 'We\'re building RBI and UPI integration roadmap compliance. PalmPay will work alongside existing payment systems while providing enhanced security through biometric verification.'
    },
    {
      question: 'What about privacy and GDPR compliance?',
      answer: 'We follow strict privacy regulations with zero-knowledge architecture. Your biometric consent is managed through smart contracts, giving you full control and transparency over data usage.'
    },
    {
      question: 'How fast are transactions?',
      answer: 'Palm verification takes less than 2 seconds with our edge processing technology. All biometric processing happens locally on secure hardware for instant verification.'
    },
    {
      question: 'What if the internet is down?',
      answer: 'Our Offline Buffer Mode allows transactions to be processed locally and synced when connectivity returns. This ensures payments work even in remote areas.'
    },
    {
      question: 'How does blockchain verification work?',
      answer: 'Every transaction and consent action is recorded on Polygon blockchain, providing immutable proof and full transparency. You can verify all your transactions independently.'
    },
    {
      question: 'Can this work with existing POS systems?',
      answer: 'Yes, our Bluetooth SDK integrates with existing POS manufacturers like Razorpay and Pine Labs. We also plan to launch dedicated PalmPOS™ devices with Android OS.'
    },
    {
      question: 'What about international usage?',
      answer: 'While we\'re starting in India, our technology is designed for global scalability. The blockchain infrastructure supports international transactions with proper regulatory compliance.'
    },
    {
      question: 'How do you prevent data breaches?',
      answer: 'Our zero-knowledge architecture means there\'s no sensitive data to breach. Only irreversible hashes are stored, distributed across blockchain nodes, making centralized attacks impossible.'
    }
  ];

  return (
    <div className="min-h-screen bg-tech-black py-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-light text-primary mb-6">
              The Secure Backbone
              <br />
              <span className="bg-gradient-to-r from-neon-green to-neon-aqua bg-clip-text text-transparent text-glow">
                of PalmPay
              </span>
            </h1>
            <p className="text-xl text-text-secondary font-light max-w-3xl mx-auto">
              Biometric-powered. Blockchain-secured. Consent-first.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Goals */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              Our Goals
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {goals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-8 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-neon-aqua mx-auto mb-6 flex items-center justify-center group-hover:neon-glow transition-all duration-300">
                  <span className="text-tech-black font-normal text-xl">{index + 1}</span>
                </div>
                <p className="text-primary font-light text-lg">{goal}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Flow */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              Technology Flow
            </h2>
            <p className="text-xl text-text-secondary font-light max-w-4xl mx-auto">
              Palm Scan → Hash Engine → Consent Contract → Blockchain Mint → Wallet Execution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300 group"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-aqua/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="text-xl font-light text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary font-light mb-4">{feature.description}</p>
                <p className="text-sm text-text-secondary/70 font-light">{feature.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Frame */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              Security Framework
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300 text-center group"
              >
                <CheckCircle className="w-8 h-8 text-neon-green mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-primary font-light">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              Technology Stack
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techStack.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300 text-center group"
              >
                <h3 className="text-lg font-light text-primary mb-2">{item.title}</h3>
                <p className="text-neon-green font-light text-glow">{item.tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patent Status */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-neon-green/10 to-neon-aqua/10 border border-neon-green/20 glass-card text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full patent-seal mb-6">
              <Award className="w-10 h-10 text-tech-black" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              Patent Status
            </h2>
            <p className="text-xl text-text-secondary font-light mb-8 max-w-3xl mx-auto">
              PalmPay™ is Patent Pending with 12+ technology claims filed with the Indian Patent Office:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {patentClaims.map((claim, index) => (
                <div key={index} className="px-4 py-2 rounded-full glass-effect border border-neon-green/30">
                  <span className="text-neon-green font-light text-sm text-glow">{claim}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PalmKiosk & PalmPOS Network */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              PalmKiosk™ + PalmPOS™ Network
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-3xl glass-card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <MapPin className="w-8 h-8 text-neon-green" />
                <h3 className="text-2xl font-light text-primary">PalmKiosk™</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-neon-green" />
                  <span className="text-text-secondary font-light">Kiosks across India for palm registration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-neon-green" />
                  <span className="text-text-secondary font-light">Liveness check & consent activation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-neon-green" />
                  <span className="text-text-secondary font-light">Works offline with sync capability</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-3xl glass-card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Smartphone className="w-8 h-8 text-neon-aqua" />
                <h3 className="text-2xl font-light text-primary">PalmPOS™</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-neon-aqua" />
                  <span className="text-text-secondary font-light">Bluetooth SDK for POS manufacturers (Razorpay, Pine Labs)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-neon-aqua" />
                  <span className="text-text-secondary font-light">Future: PalmPOS™ with Android OS + biometric scanner</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            <button
              className="btn-primary px-6 py-3 rounded-full flex items-center space-x-2"
              onClick={() => setShowSpecs(true)}
            >
              <Building className="w-5 h-5" />
              <span>View POS Specs</span>
            </button>
            <button
              className="btn-secondary px-6 py-3 rounded-full flex items-center space-x-2"
              onClick={() => setShowHost(true)}
            >
              <MapPin className="w-5 h-5" />
              <span>Host a Kiosk</span>
            </button>
            <button
              className="btn-secondary px-6 py-3 rounded-full flex items-center space-x-2"
              onClick={() => setShowLocate(true)}
            >
              <MapPin className="w-5 h-5" />
              <span>Locate PalmKiosk</span>
            </button>
          </motion.div>
          <PosSpecsModal open={showSpecs} onClose={() => setShowSpecs(false)} />
          <HostKioskModal open={showHost} onClose={() => setShowHost(false)} />
          <LocateKioskModal open={showLocate} onClose={() => setShowLocate(false)} />
        </div>
      </section>

      {/* Technical FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              Technical FAQ
            </h2>
            <p className="text-xl text-text-secondary font-light">
              Deep dive into the technical aspects of our biometric payment system.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="p-6 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-light text-primary">{item.question}</h3>
                  {openAccordion === index ? (
                    <ChevronUp className="w-5 h-5 text-neon-green" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-secondary" />
                  )}
                </button>
                {openAccordion === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-text-secondary font-light"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnologyPage;