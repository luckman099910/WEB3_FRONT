import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Hand, 
  Shield, 
  CheckCircle, 
  Coins, 
  Link as LinkIcon, 
  Play, 
  Pause, 
  RotateCcw,
  Scan,
  Zap,
  Database,
  Wallet,
  HelpCircle,
  ArrowRight,
  Eye,
  Fingerprint
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DemoPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const navigate = useNavigate();

  const demoSteps = [
    {
      id: 1,
      title: 'Palm Scan (Infrared)',
      description: 'Advanced infrared sensors capture your unique palm geometry and vein patterns',
      icon: Hand,
      color: 'from-neon-green to-sky-blue',
      details: 'Our proprietary infrared technology captures over 500 unique data points from your palm, including vein patterns, ridge formations, and geometric measurements.',
      visual: '🖐️'
    },
    {
      id: 2,
      title: 'Geometric Hashing',
      description: 'Your palm data is converted into an irreversible cryptographic hash',
      icon: Shield,
      color: 'from-purple-400 to-pink-400',
      details: 'The biometric data is processed through advanced cryptographic algorithms to create a unique hash that cannot be reverse-engineered.',
      visual: '🔐'
    },
    {
      id: 3,
      title: 'Consent Stored (Blockchain)',
      description: 'Your biometric consent is permanently logged via smart contract',
      icon: Database,
      color: 'from-blue-400 to-cyan-400',
      details: 'Every consent action is recorded on the blockchain, providing transparent and immutable proof of your authorization.',
      visual: '⛓️'
    },
    {
      id: 4,
      title: 'INR Wallet Deduction',
      description: 'Payment is executed instantly from your digital wallet',
      icon: Wallet,
      color: 'from-orange-400 to-red-400',
      details: 'Funds are transferred directly from your INR wallet to the merchant in real-time, with no intermediary delays.',
      visual: '💰'
    },
    {
      id: 5,
      title: 'Transaction Minted On-Chain',
      description: 'All transaction details are permanently recorded on blockchain',
      icon: LinkIcon,
      color: 'from-neon-green to-sky-blue',
      details: 'The complete transaction record is minted as an immutable blockchain entry, ensuring full transparency and auditability.',
      visual: '📝'
    }
  ];

  const faqs = [
    {
      question: 'How does palm scanning work?',
      answer: 'Our infrared sensors capture the unique vein patterns and geometric features of your palm, creating a biometric signature that\'s as unique as your fingerprint but more secure.'
    },
    {
      question: 'Is my biometric data stored?',
      answer: 'No, we never store your actual palm print. Only an irreversible mathematical hash is stored, making it impossible to reconstruct your original biometric data.'
    },
    {
      question: 'What if I injure my palm?',
      answer: 'Our system analyzes multiple areas of your palm and can adapt to minor injuries. You can also register both palms for backup authentication.'
    },
    {
      question: 'How secure is this compared to cards?',
      answer: 'Palm biometrics are far more secure than cards or PINs. Your palm cannot be stolen, copied, or forgotten, and our blockchain logging provides complete transaction transparency.'
    }
  ];

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="bg-tech-blue">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6">
              How
              <br />
              <span className="bg-gradient-to-r from-neon-green to-sky-blue bg-clip-text text-transparent text-glow">
                PalmPay Works
              </span>
            </h1>
            <p className="text-xl text-white/70 font-light max-w-3xl mx-auto">
              Experience the future of payments through our interactive demonstration.
              See how your palm becomes your wallet in just five secure steps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Demo Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => navigate('/palm-register')}
                disabled={isPlaying}
                className="flex items-center space-x-2 px-8 py-4 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-tech-blue font-normal hover:neon-glow transition-all duration-300 group disabled:opacity-50"
              >
                <Play className="w-5 h-5" />
                <span>Start Demo</span>
              </button>
              <button
                onClick={resetDemo}
                className="flex items-center space-x-2 px-8 py-4 rounded-full glass-effect text-white hover:bg-white/10 transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
          </motion.div>

          {/* Demo Steps Visualization */}
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
            {demoSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative p-6 rounded-3xl glass-effect transition-all duration-500 ${
                  currentStep >= index 
                    ? 'border-neon-green/50 neon-glow' 
                    : 'border-white/10'
                } ${currentStep === index ? 'scale-105' : ''}`}
                onClick={index === 0 ? () => navigate('/palm-register') : undefined}
                style={index === 0 ? { cursor: 'pointer' } : {}}
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-neon-green to-sky-blue flex items-center justify-center text-tech-blue font-normal text-sm">
                  {step.id}
                </div>

                {/* Tooltip Button */}
                <button
                  onMouseEnter={() => setShowTooltip(index)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-sky-blue/20 flex items-center justify-center hover:bg-sky-blue/40 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-sky-blue" />
                </button>

                {/* Tooltip */}
                {showTooltip === index && (
                  <div className="absolute top-8 right-0 w-64 p-4 rounded-2xl glass-effect border border-neon-green/30 z-10">
                    <p className="text-white/80 font-light text-sm">{step.details}</p>
                  </div>
                )}

                {/* Visual Indicator */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{step.visual}</div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} bg-opacity-20 w-fit mx-auto ${
                    currentStep === index ? 'animate-pulse' : ''
                  }`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-light text-white mb-2 text-center">{step.title}</h3>
                <p className="text-white/70 font-light text-sm text-center">{step.description}</p>

                {/* Progress Indicator */}
                {currentStep >= index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-neon-green flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-tech-blue" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Current Step Details */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8 rounded-3xl bg-gradient-to-br from-neon-green/10 to-sky-blue/10 border border-neon-green/20 glass-effect mb-16"
            >
              <h3 className="text-2xl font-light text-white mb-4">
                Currently Processing: {demoSteps[currentStep]?.title}
              </h3>
              <p className="text-white/70 font-light max-w-2xl mx-auto">
                {demoSteps[currentStep]?.details}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Interactive Simulation */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Try It Yourself
            </h2>
            <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
              Experience a simulated palm scan and see how the technology works in real-time.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="relative p-12 rounded-3xl glass-effect border border-neon-green/30 mb-8">
                <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-neon-green/50 flex items-center justify-center">
                  <div className="text-center">
                    <Hand className="w-24 h-24 text-neon-green mx-auto mb-4 animate-pulse" />
                    <p className="text-neon-green font-light text-glow">Place your palm here</p>
                  </div>
                </div>
                
                {/* Scanning Animation */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent animate-pulse"></div>
                </div>
              </div>

              <button className="flex items-center space-x-2 px-8 py-4 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-tech-blue font-normal hover:neon-glow transition-all duration-300 group mx-auto"
                onClick={() => navigate('/palm-register')}
              >
                <Scan className="w-5 h-5" />
                <span>Simulate Scan</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl glass-effect">
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="w-6 h-6 text-neon-green" />
                  <h3 className="text-xl font-light text-white">What We See</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Unique vein patterns</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Palm geometry measurements</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Ridge and line formations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-white/80 font-light">Liveness detection signals</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl glass-effect">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-sky-blue" />
                  <h3 className="text-xl font-light text-white">What We Store</h3>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 mb-4">
                  <p className="text-white/70 font-mono text-sm">
                    Hash: a1b2c3d4e5f6...xyz789
                  </p>
                </div>
                <p className="text-white/60 font-light text-sm">
                  Only an irreversible mathematical representation. Your actual palm print is never stored.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Quick Questions
            </h2>
            <p className="text-xl text-white/70 font-light">
              Common questions about how PalmPay works.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-3xl glass-effect hover:border-neon-green/30 transition-all duration-300"
              >
                <h3 className="text-lg font-light text-white mb-3">{faq.question}</h3>
                <p className="text-white/70 font-light">{faq.answer}</p>
              </motion.div>
            ))}
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
            className="p-8 rounded-3xl bg-gradient-to-br from-neon-green/10 to-sky-blue/10 border border-neon-green/20 glass-effect"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-sky-blue mb-6">
              <Fingerprint className="w-8 h-8 text-tech-blue" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Ready to Experience PalmPay?
            </h2>
            <p className="text-xl text-white/70 font-light mb-8">
              Join the waitlist to be among the first to use palm-based payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/applicants-register"
                className="flex items-center space-x-2 px-8 py-4 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-tech-blue font-normal hover:neon-glow transition-all duration-300 group animate-glow"
              >
                <span>Join Waitlist</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 rounded-full glass-effect text-white hover:bg-white/10 hover:border-neon-green/50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;