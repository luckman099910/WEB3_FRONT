import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Building, 
  DollarSign,
  Users,
  Globe,
  Award,
  Target,
  Heart,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: ''
  });

  const [vendorData, setVendorData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    palmpos: false,
    palmkiosk: false,
    integration: false,
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vendor form submitted:', vendorData);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      detail: 'hello@palmpay.com',
      description: 'Drop us a line anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      detail: '+91 80 4567 8901',
      description: '24/7 support available'
    },
    {
      icon: MapPin,
      title: 'Office',
      detail: 'Bangalore, India',
      description: 'Visit our headquarters'
    }
  ];

  const aboutSections = [
    {
      icon: Target,
      title: 'Our Mission',
      content: 'To revolutionize payments in India by making biometric authentication accessible, secure, and convenient for everyone. We believe your palm should be your wallet.'
    },
    {
      icon: Lightbulb,
      title: 'Our Vision',
      content: 'A cashless India where every transaction is secured by biometric verification, eliminating fraud while preserving privacy through blockchain technology.'
    },
    {
      icon: Heart,
      title: 'Our Values',
      content: 'Privacy-first design, transparent blockchain logging, user consent control, and inclusive technology that works for everyone, everywhere.'
    }
  ];

  const achievements = [
    { number: '12+', label: 'Patent Claims Filed' },
    { number: '99.9%', label: 'Biometric Accuracy' },
    { number: '<2s', label: 'Transaction Speed' },
    { number: '100%', label: 'Privacy Protection' }
  ];

  return (
    <div className="bg-tech-black">
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
              About PalmPay &
              <br />
              <span className="bg-gradient-to-r from-neon-green to-neon-aqua bg-clip-text text-transparent text-glow">
                Get In Touch
              </span>
            </h1>
            <p className="text-xl text-text-secondary font-light max-w-3xl mx-auto">
              Learn about our mission to revolutionize payments and connect with our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About PalmPay */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              About PalmPay
            </h2>
            <p className="text-xl text-text-secondary font-light max-w-2xl mx-auto">
              Pioneering the future of biometric payments in India
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {aboutSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-8 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-aqua/20 mb-6">
                  <section.icon className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="text-xl font-light text-primary mb-4">{section.title}</h3>
                <p className="text-text-secondary font-light">{section.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-4 gap-6"
          >
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 rounded-3xl glass-card">
                <div className="text-3xl font-light text-neon-green mb-2 text-glow">{achievement.number}</div>
                <div className="text-text-secondary font-light text-sm">{achievement.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-primary mb-4">
              Contact Information
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-8 rounded-3xl glass-card hover:border-neon-green/30 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-aqua/20 mb-4">
                  <info.icon className="w-8 h-8 text-neon-green" />
                </div>
                <h3 className="text-xl font-light text-primary mb-2">{info.title}</h3>
                <p className="text-neon-green font-light mb-2 text-glow">{info.detail}</p>
                <p className="text-text-secondary font-light text-sm">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* General Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-neon-green/10 to-neon-aqua/10 border border-neon-green/20 glass-card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <MessageCircle className="w-8 h-8 text-neon-green" />
                <h2 className="text-2xl font-light text-primary">General Inquiry</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl input-field font-light"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-2">Email/Phone</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl input-field font-light"
                    placeholder="your@email.com or phone"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-text-secondary mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl input-field font-light"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="user">User</option>
                    <option value="merchant">Merchant</option>
                    <option value="investor">Investor</option>
                    <option value="developer">Developer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl input-field resize-none font-light"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary px-6 py-3 rounded-full flex items-center justify-center space-x-2 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>Submit</span>
                </button>
              </form>
            </motion.div>

            {/* Vendor Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-purple-400/10 to-pink-400/10 border border-purple-400/20 glass-card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Building className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-light text-primary">Vendor Registration</h2>
              </div>
              
              <form onSubmit={handleVendorSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-text-secondary mb-2">Business Name</label>
                    <input
                      type="text"
                      value={vendorData.businessName}
                      onChange={(e) => setVendorData({...vendorData, businessName: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl input-field font-light"
                      placeholder="Your business name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light text-text-secondary mb-2">Owner Name</label>
                    <input
                      type="text"
                      value={vendorData.ownerName}
                      onChange={(e) => setVendorData({...vendorData, ownerName: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl input-field font-light"
                      placeholder="Owner name"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-text-secondary mb-2">Email</label>
                    <input
                      type="email"
                      value={vendorData.email}
                      onChange={(e) => setVendorData({...vendorData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl input-field font-light"
                      placeholder="business@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light text-text-secondary mb-2">Phone</label>
                    <input
                      type="tel"
                      value={vendorData.phone}
                      onChange={(e) => setVendorData({...vendorData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl input-field font-light"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-2">Address/Location</label>
                  <input
                    type="text"
                    value={vendorData.address}
                    onChange={(e) => setVendorData({...vendorData, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl input-field font-light"
                    placeholder="Business address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-text-secondary mb-3">Interested In:</label>
                  <div className="space-y-3">
                    {[
                      { key: 'palmpos', label: 'PalmPOS™ Integration' },
                      { key: 'palmkiosk', label: 'PalmKiosk™ Setup' },
                      { key: 'integration', label: 'API Integration' }
                    ].map((option) => (
                      <div key={option.key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={vendorData[option.key as keyof typeof vendorData] as boolean}
                          onChange={(e) => setVendorData({...vendorData, [option.key]: e.target.checked})}
                          className="w-4 h-4 text-neon-green bg-transparent border-white/20 rounded focus:ring-neon-green"
                        />
                        <span className="text-text-secondary font-light">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-2">Comments/Message</label>
                  <textarea
                    value={vendorData.message}
                    onChange={(e) => setVendorData({...vendorData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl input-field resize-none font-light"
                    placeholder="Tell us about your business needs..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-normal hover:neon-glow-aqua transition-all duration-300 group"
                >
                  <Building className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Register as Vendor</span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light text-primary mb-4">
              Connect With Us
            </h2>
            <p className="text-text-secondary font-light">
              Follow our journey and stay updated with the latest developments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.a
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              href="#"
              className="flex items-center space-x-4 p-6 rounded-3xl bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group glass-card"
            >
              <MessageCircle className="w-12 h-12 text-green-400 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-xl font-light text-primary">WhatsApp</h3>
                <p className="text-text-secondary font-light">Instant support & queries</p>
              </div>
            </motion.a>

            <motion.a
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              href="#"
              className="flex items-center space-x-4 p-6 rounded-3xl bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border border-blue-500/30 hover:border-cyan-400/50 transition-all duration-300 group glass-card"
            >
              <Globe className="w-12 h-12 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-xl font-light text-primary">Telegram</h3>
                <p className="text-text-secondary font-light">Join our community</p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;