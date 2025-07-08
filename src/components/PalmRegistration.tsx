import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { api, safeJsonParse } from '../api/palmPayApi';

interface PalmRegistrationProps {
  onSuccess?: (user: any) => void;
  onClose?: () => void;
}

const PalmRegistration: React.FC<PalmRegistrationProps> = ({ onSuccess, onClose }) => {
  // Simulate palm scan data as a random string (replace with real scan in production)
  const [handinfo, setHandinfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Simulate palm scan (replace with real scan logic)
  const handleScanPalm = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setHandinfo("handinfo_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now());
      setLoading(false);
    }, 2000);
  };

  // Submit handinfo to backend for registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      // Get user from localStorage (assume user is logged in)
      const user = safeJsonParse(localStorage.getItem('user'), {});
      if (!user || !user.id) throw new Error('User not logged in');
      const res = await api.post('/api/registerPalm', {
        userId: user.id,
        handinfo
      });
      setSuccess(true);
      if (onSuccess) onSuccess(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div className="p-8 rounded-3xl bg-gradient-to-br from-fintech-green/20 to-electric-blue/20 border border-fintech-green/30 backdrop-blur-xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fintech-green mb-4">
          <CheckCircle className="w-8 h-8 text-black" />
        </div>
        <h3 className="text-xl font-ultralight text-white mb-2">Palm Registered!</h3>
        <p className="text-white/70 font-ultralight mb-6">Your palm scan has been registered.</p>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300"
          >
            Close
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
      <h2 className="text-2xl font-light text-primary mb-6">Palm Registration</h2>
      {error && (
        <div className="mb-4 text-red-500 flex items-center gap-2"><AlertCircle /> {error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-white/70 mb-2">Palm Scan Data</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={handinfo}
              readOnly
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
              placeholder="Scan your palm to generate data"
              required
            />
            <button
              type="button"
              onClick={handleScanPalm}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-fintech-green to-electric-blue text-black font-medium hover:shadow-lg hover:shadow-fintech-green/25 transition-all duration-300"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Scan Palm"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium"
          disabled={loading || !handinfo}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Register Palm"}
        </button>
      </form>
    </motion.div>
  );
};

export default PalmRegistration; 