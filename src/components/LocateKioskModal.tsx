import React from 'react';

interface LocateKioskModalProps {
  open: boolean;
  onClose: () => void;
}

const KIOSK_LOCATIONS = [
  {
    name: 'Bangalore Central',
    lat: 12.9716,
    lng: 77.5946,
    address: 'MG Road, Bangalore',
    status: 'Active',
    type: 'Govt CSC',
    hours: '9am - 7pm',
  },
  {
    name: 'Delhi Connaught',
    lat: 28.6315,
    lng: 77.2167,
    address: 'Connaught Place, Delhi',
    status: 'Active',
    type: 'Retail',
    hours: '10am - 8pm',
  },
  {
    name: 'Mumbai Gateway',
    lat: 18.9218,
    lng: 72.8347,
    address: 'Gateway of India, Mumbai',
    status: 'Active',
    type: 'Tourist',
    hours: '8am - 9pm',
  },
];

const MAP_URL = `https://www.openstreetmap.org/export/embed.html?bbox=72.8,12.9,77.7,28.7&layer=mapnik`;

const LocateKioskModal: React.FC<LocateKioskModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-tech-black rounded-3xl p-8 max-w-3xl w-full shadow-2xl border border-neon-green/30 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neon-green hover:text-white text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-light text-primary mb-6 text-center">Locate PalmKiosk™</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 min-w-[250px]">
            <iframe
              title="PalmKiosk Map"
              src={MAP_URL}
              className="w-full h-64 md:h-80 rounded-xl border border-neon-green/20"
              style={{ minHeight: 250 }}
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <ul className="space-y-4">
              {KIOSK_LOCATIONS.map((kiosk, idx) => (
                <li key={idx} className="p-4 rounded-xl glass-card border border-neon-green/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-neon-green font-medium">{kiosk.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">{kiosk.status}</span>
                  </div>
                  <div className="text-text-secondary text-sm mb-1">{kiosk.address}</div>
                  <div className="text-xs text-text-secondary/70">Type: {kiosk.type} | Hours: {kiosk.hours}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocateKioskModal; 