import React, { useState } from 'react';

interface HostKioskModalProps {
  open: boolean;
  onClose: () => void;
}

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  premises: '',
  footfall: '',
  power: false,
  internet: false,
};

const HostKioskModal: React.FC<HostKioskModalProps> = ({ open, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Simple validation
    if (!form.name || !form.email || !form.phone || !form.address || !form.premises || !form.footfall) {
      setError('Please fill all required fields.');
      return;
    }
    setStatus('success'); // Simulate success
    // setStatus('error'); // Uncomment to simulate error
  };

  const handleClose = () => {
    setForm(initialForm);
    setStatus('idle');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-tech-black rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-neon-green/30 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neon-green hover:text-white text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-light text-primary mb-6 text-center">Host a PalmKiosk™</h2>
        {status === 'success' ? (
          <div className="text-green-400 text-center py-8">
            Thank you! Your application has been submitted.<br />We will contact you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-text-secondary mb-1">Name*</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field px-4 py-2 rounded-xl border focus:border-neon-green bg-black/40" required />
            </div>
            <div className="flex flex-col">
              <label className="text-text-secondary mb-1">Email*</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field px-4 py-2 rounded-xl border focus:border-neon-green bg-black/40" required />
            </div>
            <div className="flex flex-col">
              <label className="text-text-secondary mb-1">Phone*</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field px-4 py-2 rounded-xl border focus:border-neon-green bg-black/40" required />
            </div>
            <div className="flex flex-col">
              <label className="text-text-secondary mb-1">Address*</label>
              <input name="address" value={form.address} onChange={handleChange} className="input-field px-4 py-2 rounded-xl border focus:border-neon-green bg-black/40" required />
            </div>
            <div className="flex flex-col">
              <label className="text-text-secondary mb-1">Type of Premises*</label>
              <select name="premises" value={form.premises} onChange={handleChange} className="input-field px-4 py-2 rounded-xl border focus:border-neon-green bg-black/40" required>
                <option value="">Select</option>
                <option value="School">School</option>
                <option value="Office">Office</option>
                <option value="Store">Store</option>
                <option value="NGO">NGO</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-text-secondary mb-1">Daily Footfall Estimate*</label>
              <input name="footfall" value={form.footfall} onChange={handleChange} className="input-field px-4 py-2 rounded-xl border focus:border-neon-green bg-black/40" required />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="power" checked={form.power} onChange={handleChange} />
                Power Available
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="internet" checked={form.internet} onChange={handleChange} />
                Internet Available
              </label>
            </div>
            {error && <div className="text-red-400 text-center">{error}</div>}
            <button
              type="submit"
              className="btn-primary w-full mt-2 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:brightness-110"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HostKioskModal; 