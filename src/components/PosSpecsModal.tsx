import React from 'react';

interface PosSpecsModalProps {
  open: boolean;
  onClose: () => void;
}

const POS_SPECS = [
  { label: 'Device Type', value: 'PalmPOS™ Basic / PalmPOS™ Pro' },
  { label: 'Supported OS', value: 'Android 10+' },
  { label: 'Required SDK', value: 'Bluetooth + Biometric API integration' },
  { label: 'Screen Size', value: '5.5" / 6.5" IPS LCD' },
  { label: 'Camera', value: 'IR/3D Depth Camera' },
  { label: 'Memory', value: '4GB RAM / 64GB Storage' },
  { label: 'Connectivity', value: 'WiFi, 4G LTE, Bluetooth 5.0' },
  { label: 'Battery', value: '5000mAh (8+ hours)' },
  { label: 'Security', value: 'TPM, Secure Boot, Encrypted Storage' },
];

const PosSpecsModal: React.FC<PosSpecsModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-tech-black rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-neon-green/30 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neon-green hover:text-white text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-light text-primary mb-6 text-center">PalmPOS™ Device Specifications</h2>
        <ul className="space-y-3">
          {POS_SPECS.map((spec, idx) => (
            <li key={idx} className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-text-secondary font-light">{spec.label}</span>
              <span className="text-neon-green font-medium">{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PosSpecsModal; 