import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Hand, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/palmpay-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Technology', path: '/technology' },
    { name: 'Features', path: '/features' },
    { name: 'Demo', path: '/demo' },
    { name: 'About / Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logo} alt="PalmPay Logo" className="h-14 w-auto rounded-xl" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-light transition-all duration-300 hover:text-neon-green hover:text-glow ${
                  location.pathname === item.path
                    ? 'text-neon-green text-glow border-b border-neon-green'
                    : 'text-text-secondary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate('/user-dashboard')}
                  className="flex items-center space-x-2 px-6 py-3 rounded-full btn-primary group animate-glow bg-blue-500/80 hover:bg-blue-600 transition-colors"
                >
                  <span>User Page</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-6 py-3 rounded-full btn-primary group animate-glow bg-red-500/80 hover:bg-red-600 transition-colors"
                >
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/user-dashboard"
                className="flex items-center space-x-2 px-6 py-3 rounded-full btn-primary group animate-glow"
              >
                <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Launch App</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg glass-effect hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-full left-0 right-0 glass-effect border-b border-white/5"
        >
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 text-lg font-light transition-all duration-300 hover:text-neon-green hover:text-glow ${
                  location.pathname === item.path
                    ? 'text-neon-green text-glow'
                    : 'text-text-secondary'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => { setIsOpen(false); navigate('/user-dashboard'); }}
                  className="flex items-center space-x-2 px-6 py-3 rounded-full btn-primary group w-fit animate-glow bg-blue-500/80 hover:bg-blue-600 transition-colors mb-2"
                >
                  <span>User Page</span>
                </button>
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="flex items-center space-x-2 px-6 py-3 rounded-full btn-primary group w-fit animate-glow bg-red-500/80 hover:bg-red-600 transition-colors"
                >
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/user-dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-6 py-3 rounded-full btn-primary group w-fit animate-glow"
              >
                <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Launch App</span>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;