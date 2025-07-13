import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, RotateCcw, Camera as CameraIcon, ArrowLeft } from 'lucide-react';
import { registerPalmHash, safeJsonParse } from '../api/palmPayApi';
import { useNavigate } from 'react-router-dom';
import PalmScanBox from './PalmScanBox';

interface HandScanRegisterProps {
  onCancel?: () => void;
  demoMode?: boolean;
}

const HandScanRegister: React.FC<HandScanRegisterProps> = ({ onCancel, demoMode = false }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [handInBox, setHandInBox] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('Place your palm in the box and hold steady');
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  // Demo mode: always show palm outline and scanning bar
  useEffect(() => {
    if (demoMode) {
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
          setSuccess(true);
          setFeedbackMsg('Palm registered successfully!');
        }, 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [demoMode]);

  // Real registration logic would go here (omitted for demo)

  return (
    <div className="bg-deep-navy text-text-primary h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="relative w-full flex flex-col items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-0 flex items-center gap-1 text-white/70 hover:text-neon-green transition-colors z-10 px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-light">Back</span>
          </button>
          <h2 className="text-2xl font-bold text-white text-center w-full">Hand Scan &amp; Register</h2>
        </div>
        {/* PalmScanBox */}
        <PalmScanBox
          isAligned={handInBox}
          feedbackMsg={feedbackMsg}
          demoMode={demoMode}
          scanning={scanning}
        />
        {/* Progress Bar */}
        <div className="w-full h-2 bg-deep-navy rounded mb-2 overflow-hidden mt-4">
          <div
            className="h-full bg-electric-blue transition-all duration-100 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {/* Status Messages */}
        {error && !success && (
          <div className="mb-2 text-red-400 text-center text-sm flex items-center justify-center gap-1">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-2 text-fintech-green text-center text-sm flex items-center justify-center gap-1">
            <CheckCircle size={16} />
            Palm registered successfully!
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex gap-2 justify-center mb-1 mt-2">
          {!success ? (
            <button
              onClick={() => {}}
              disabled={demoMode || scanning || progress < 1}
              className="bg-electric-blue hover:bg-neon-aqua disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1"
            >
              <CameraIcon size={16} />
              Register Palm
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="bg-fintech-green hover:bg-neon-green text-black px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1"
            >
              <RotateCcw size={16} />
              Scan Again
            </button>
          )}
        </div>
        {/* Instructions */}
        <div className="text-center text-text-secondary text-xs mt-2">
          Hold your hand steady inside the green box for 5 seconds to register your palm.
        </div>
      </div>
    </div>
  );
};

export default HandScanRegister; 