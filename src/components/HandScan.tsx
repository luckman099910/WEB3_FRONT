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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera setup (only if not demoMode)
  useEffect(() => {
    if (demoMode) {
      setLoading(false);
      return;
    }
    setLoading(true);
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Could not access camera: ' + err.message);
        setLoading(false);
      });
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [demoMode]);

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
      {/* Video Feed (only if not demoMode) */}
      {!demoMode && (
        <div className="relative w-full flex justify-center items-center" style={{ minHeight: 400 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl z-0"
            style={{ background: '#10131c', maxHeight: 400 }}
          />
        </div>
      )}
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