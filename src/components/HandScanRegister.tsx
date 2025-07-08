import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, RotateCcw, Camera, X } from 'lucide-react';
import { api } from '../api/palmPayApi';

const INSPECTION_TIME = 4000; // ms

interface HandScanRegisterProps {
  onCancel?: () => void;
}

const HandScanRegister: React.FC<HandScanRegisterProps> = ({ onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [handData, setHandData] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [captureStarted, setCaptureStarted] = useState(false);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraReady(true);
      setError('');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied or unavailable.');
      setCameraReady(false);
      setScanning(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setCameraReady(false);
  };

  // Simulate hand detection and start capture
  const handleStartCapture = () => {
    setCaptureStarted(true);
    setError('');
    setProgress(0);
    setScanning(true);
    // Start the inspection timeline
    let elapsed = 0;
    const interval = 100;
    const timer = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min(100, (elapsed / INSPECTION_TIME) * 100));
      if (elapsed >= INSPECTION_TIME) {
        clearInterval(timer);
        // Simulate image quality check (random fail for 'too dark' or 'blurry')
        const isQualityGood = Math.random() > 0.15; // 85% chance of good quality
        if (!isQualityGood) {
          setError('Image quality is too low (too dark or blurry). Please try again.');
          setScanning(false);
          setCaptureStarted(false);
          stopCamera();
          return;
        }
        // Simulate probability-based accuracy (e.g., 90% success)
        const isAccurate = Math.random() < 0.9;
        if (isAccurate) {
          const simulatedHandData = `handdata_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
          setHandData(simulatedHandData);
          registerHand(simulatedHandData);
        } else {
          setError('Scan failed. Please try again.');
          setScanning(false);
          setCaptureStarted(false);
          stopCamera();
        }
      }
    }, interval);
  };

  // Register hand data with backend
  const registerHand = async (handinfo: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user || !user.id) throw new Error('User not logged in');
      await api.post('/api/registerPalm', {
        userId: user.id,
        handinfo
      });
      setSuccess(true);
      stopCamera();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      stopCamera();
    } finally {
      setScanning(false);
      setCaptureStarted(false);
    }
  };

  const handleRescan = () => {
    setError('');
    setSuccess(false);
    setProgress(0);
    setHandData('');
    setScanning(false);
    setCaptureStarted(false);
    startCamera();
  };

  // Remove scrollbar from overlay
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Start camera on mount
  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 max-w-2xl w-full flex flex-col items-center shadow-2xl">
        <h2 className="text-4xl font-light text-primary mb-10 text-center">Palm Registration</h2>
        {error && (
          <div className="mb-6 text-red-500 flex items-center gap-2 justify-center text-lg"><AlertCircle /> {error}</div>
        )}
        {success ? (
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-fintech-green mb-6">
              <CheckCircle className="w-12 h-12 text-black" />
            </div>
            <h3 className="text-2xl font-ultralight text-white mb-4">Registration Complete!</h3>
            <p className="text-white/70 font-ultralight mb-8 text-lg">Your palm scan has been registered and securely stored.</p>
            <div className="text-sm text-white/40 break-all text-center">Hand Data: {handData}</div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full px-8 py-4 rounded-full bg-white/20 text-white font-medium flex items-center justify-center gap-2 text-lg mt-8 border border-white/30 hover:bg-white/30 transition"
              >
                <X className="w-6 h-6" /> Close
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-10">
              <div className="relative rounded-3xl overflow-hidden border-4 border-neon-green shadow-xl bg-black w-[480px] h-[360px] flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {!captureStarted && cameraReady && !scanning && (
                  <button
                    onClick={handleStartCapture}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/20 transition-colors cursor-pointer"
                  >
                    <Camera className="w-12 h-12 text-neon-green mb-2 animate-pulse" />
                    <span className="text-neon-green text-xl font-medium">Start Capture</span>
                  </button>
                )}
              </div>
            </div>
            <div className="mb-10 w-full">
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-4 bg-gradient-to-r from-neon-green to-electric-blue rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {scanning && <div className="text-white/60 text-base mt-4 text-center">Inspecting... Please hold your hand steady inside the border</div>}
            </div>
            <button
              onClick={handleRescan}
              className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium flex items-center justify-center gap-2 text-lg mb-2"
              style={{ display: error && !success ? 'flex' : 'none' }}
            >
              <RotateCcw className="w-6 h-6" /> Rescan
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full px-8 py-4 rounded-full bg-white/20 text-white font-medium flex items-center justify-center gap-2 text-lg mt-2 border border-white/30 hover:bg-white/30 transition"
              >
                <X className="w-6 h-6" /> Cancel
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default HandScanRegister; 