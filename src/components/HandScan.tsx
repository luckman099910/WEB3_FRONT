import React, { useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SignJWT } from 'jose';
import PalmScanBox from './PalmScanBox';

const STEADY_TIME = 3000; // ms (3 seconds steady for scan)

interface HandScanProps {
  onSuccess: (scanValue: string) => void;
  onCancel?: () => void;
  demoMode?: boolean;
}

const HandScan: React.FC<HandScanProps> = ({ onSuccess, onCancel, demoMode = false }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [handInBox, setHandInBox] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('Place your palm in the box and hold steady');
  const [scanning, setScanning] = useState(false);

  // Demo mode: always show palm outline and scanning bar
  useEffect(() => {
    if (demoMode) {
      setLoading(false);
      setHandInBox(false);
      setFeedbackMsg('Palm not aligned. Please adjust to fit inside the box.');
      setScanning(true);
    }
  }, [demoMode]);

  // Simulate scan success in demo mode
  useEffect(() => {
    if (demoMode) {
      const timer = setTimeout(() => {
        setHandInBox(true);
        setFeedbackMsg('Perfect! Scanning in progress…');
        setScanning(true);
        setTimeout(() => {
          setProgress(1);
          onSuccess('demo-scan-value');
        }, 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [demoMode, onSuccess]);

  // Real camera/detection logic would go here (omitted for demo)

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      {/* Feedback and scan box */}
      <PalmScanBox
        isAligned={handInBox}
        feedbackMsg={feedbackMsg}
        demoMode={demoMode}
        scanning={scanning}
      />
      {/* Progress Bar */}
      <div className="w-full mt-4 flex flex-col items-center">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="h-2 bg-gradient-to-r from-neon-green to-sky-blue rounded-full" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        {error && (
          <div className="mt-2 p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-2">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 px-6 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default HandScan; 