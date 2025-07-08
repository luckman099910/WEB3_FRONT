import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface TransactionProcessorProps {
  merchantId: string;
  onSuccess?: (result: any) => void;
  onClose?: () => void;
}

const TransactionProcessor: React.FC<TransactionProcessorProps> = ({ merchantId, onSuccess, onClose }) => {
  const [amount, setAmount] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, amount: Number(amount), hash })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Transaction failed");
      setSuccess(true);
      if (onSuccess) onSuccess(data);
    } catch (err: any) {
      setError(err.message);
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
        <h3 className="text-xl font-ultralight text-white mb-2">Transaction Successful!</h3>
        <p className="text-white/70 font-ultralight mb-6">The payment has been processed.</p>
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
      <h2 className="text-2xl font-light text-primary mb-6">Process Transaction</h2>
      {error && (
        <div className="mb-4 text-red-500 flex items-center gap-2"><AlertCircle /> {error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-white/70 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
            placeholder="Enter amount"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-2">Palm Hash</label>
          <input
            type="text"
            value={hash}
            onChange={e => setHash(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
            placeholder="Enter palm scan hash"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Process Transaction"}
        </button>
      </form>
    </motion.div>
  );
};

export default TransactionProcessor; 