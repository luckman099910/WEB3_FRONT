import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, Store, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { assignBalance, getUsers } from "../api/adminApi";
import { safeJsonParse } from '../api/palmPayApi';

const AdminBalanceManager = ({ onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.users || data))
      .catch((err) => setError(err.message));
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await assignBalance(selectedUser, Number(amount));
      setSuccess("Balance assigned successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only show if user is admin
  const user = safeJsonParse(localStorage.getItem("user"), null);
  if (!user || user.role !== "admin") return null;

  return (
    <motion.div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
      <h2 className="text-2xl font-light text-primary mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6" /> Admin Balance Manager
      </h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {success && <div className="mb-4 text-green-500">{success}</div>}
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-sm text-white/70 mb-2">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
            required
          >
            <option value="">-- Select a user --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username || u.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none"
            placeholder="Enter amount"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 rounded-full btn-primary animate-glow font-medium"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Assign Balance"}
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-lg text-white/80 mb-2 flex items-center gap-2">
          <Users className="w-5 h-5" /> User List
        </h3>
        <ul className="space-y-2">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u) => (
              <li key={u.id} className="p-3 rounded-xl bg-white/10 border border-white/20 text-white flex justify-between items-center">
                <span>{u.username || u.email}</span>
                <span className="text-sm text-neon-green">Balance: {u.balance}</span>
              </li>
            ))
          ) : (
            <li className="text-white/50 font-ultralight text-center py-4">No users found.</li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};

export default AdminBalanceManager; 