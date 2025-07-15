import React, { useRef, useState, useEffect } from 'react';
import { Loader2, User } from 'lucide-react';
import { SignJWT } from 'jose';
import PalmScanBox from './PalmScanBox';
import { api } from '../api/palmPayApi';

interface HandScanProps {
  onSuccess: (scanValue: string) => void;
  onCancel?: () => void;
  demoMode?: boolean;
}

const HAND_SCAN_SECRET = 'secret'; // Must match backend
const TIMER_SECONDS = 5;

const HandScan: React.FC<HandScanProps> = ({ onSuccess, onCancel, demoMode = false }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [handInBox, setHandInBox] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('Place your palm in the box and hold steady');
  const [scanning, setScanning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [backendMsg, setBackendMsg] = useState('');
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showRetry, setShowRetry] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLandmarks = useRef<any>(null);
  const sentRef = useRef(false);
  const [showCamera, setShowCamera] = useState(true); // NEW: toggle state

  // Camera and MediaPipe Hands setup
  useEffect(() => {
    if (demoMode) {
      setLoading(false);
      return;
    }
    setLoading(true);
    let camera: any = null;
    let stopped = false;
    let hands: any = null;
    let handsScript: HTMLScriptElement | null = null;
    let cameraScript: HTMLScriptElement | null = null;

    function setupPalmScan() {
      // Use window.Hands and window.Camera from CDN
      const Hands = (window as any).Hands;
      const Camera = (window as any).Camera;
      console.log('[PalmScan] window.Hands:', Hands);
      console.log('[PalmScan] window.Camera:', Camera);
      if (!Hands) {
        setError('Palm detection module failed to load (window.Hands not found).');
        return;
      }
      if (!Camera) {
        setError('Camera module failed to load (window.Camera not found).');
        return;
      }
      hands = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });
      hands.onResults((results: any) => {
        if (stopped) return;
        const lm = results.multiHandLandmarks && results.multiHandLandmarks[0];
        if (lm && isHandAligned(lm)) {
          setHandInBox(true);
          setFeedbackMsg('Hold steady to scan...');
          lastLandmarks.current = lm;
          console.log('[PalmScan] Hand detected and aligned.');
        } else {
          setHandInBox(false);
          setFeedbackMsg('Place your palm in the box and hold steady');
          lastLandmarks.current = null;
          if (timerRef.current) console.log('[PalmScan] Hand moved out, timer reset.');
        }
      });
      camera = new Camera(videoRef.current!, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current! });
        },
        width: 640,
        height: 480,
      });
      camera.start();
      setLoading(false);
      console.log('[PalmScan] Camera and MediaPipe Hands started.');
    }

    // Dynamically load camera_utils.js from CDN first
    cameraScript = document.createElement('script');
    cameraScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
    cameraScript.async = true;
    cameraScript.onload = () => {
      console.log('[PalmScan] camera_utils.js loaded from CDN');
      // Now load hands.js
      handsScript = document.createElement('script');
      handsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
      handsScript.async = true;
      handsScript.onload = () => {
        console.log('[PalmScan] hands.js loaded from CDN');
        setupPalmScan();
      };
      handsScript.onerror = () => {
        setError('Failed to load palm detection script.');
        setLoading(false);
      };
      document.body.appendChild(handsScript);
    };
    cameraScript.onerror = () => {
      setError('Failed to load camera script.');
      setLoading(false);
    };
    document.body.appendChild(cameraScript);

    return () => {
      stopped = true;
      if (camera) camera.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (handsScript) document.body.removeChild(handsScript);
      if (cameraScript) document.body.removeChild(cameraScript);
    };
  }, [demoMode]);

  // Timer logic: start when hand is in box, reset if not
  useEffect(() => {
    if (scanComplete || demoMode) return;
    if (handInBox) {
      if (timer === 0) setTimer(TIMER_SECONDS);
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTimer((t) => {
            if (t > 0) return t - 1;
            return 0;
          });
        }, 1000);
        console.log('[PalmScan] Timer started.');
      }
    } else {
      setTimer(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [handInBox, scanComplete, demoMode]);

  // When timer reaches 0 and hand is still in box, enable scan button
  useEffect(() => {
    if (scanComplete || demoMode) return;
    // Only allow scan if timer is exactly 0, hand is in box, and scan not sent
    if (timer === 0 && handInBox && lastLandmarks.current && !sentRef.current) {
      setScanning(true);
    } else {
      setScanning(false);
    }
  }, [timer, handInBox, scanComplete, demoMode]);

  // Only send request when timer is 0 and scanning is true (prevents early requests)
  useEffect(() => {
    if (scanning && !sentRef.current && !scanComplete && timer === 0) {
      handleScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning, timer]);

  const handleScan = async () => {
    setScanComplete(true);
    setRequestStatus('loading');
    setFeedbackMsg('Scanning...');
    sentRef.current = true;
    setShowRetry(false);
    try {
      // Sign landmarks as JWT
      const payload = JSON.stringify(lastLandmarks.current);
      const jwt = await new SignJWT({ data: payload })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(new TextEncoder().encode(HAND_SCAN_SECRET));
      setFeedbackMsg('Scan complete! Sending...');
      // Call parent onSuccess (parent will send request)
      await onSuccess(jwt);
      setRequestStatus('success');
      setBackendMsg('Scan successful!');
    } catch (err: any) {
      setRequestStatus('error');
      setError('Scan failed. Please try again.');
      setShowRetry(true);
      setScanComplete(false);
      sentRef.current = false;
      setFeedbackMsg('Place your palm in the box and hold steady');
      console.error('[PalmScan] Error:', err);
    }
  };

  const handleRetry = () => {
    setError('');
    setBackendMsg('');
    setRequestStatus('idle');
    setScanComplete(false);
    setShowRetry(false);
    sentRef.current = false;
    setTimer(0);
    setFeedbackMsg('Place your palm in the box and hold steady');
    // Ensure the scan UI remains visible and resets for a new attempt
  };

  // Hand alignment check (basic: hand center in box, hand size reasonable)
  function isHandAligned(lm: any[]): boolean {
    // Get bounding box
    const xs = lm.map((p) => p.x);
    const ys = lm.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    // Center and size thresholds (expanded for easier alignment)
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX;
    const height = maxY - minY;
    // Expanded: allow more leeway for center and size
    const aligned = (
      centerX > 0.30 && centerX < 0.70 &&
      centerY > 0.30 && centerY < 0.70 &&
      width > 0.20 && width < 0.80 &&
      height > 0.20 && height < 0.80
    );
    if (aligned) console.log('[PalmScan] Hand is aligned.');
    return aligned;
  }

  // Helper: normalize landmarks to [0,1] for SVG overlay
  function getNormalizedLandmarks(lm: any[]): Array<{ x: number; y: number }> {
    if (!lm || lm.length === 0) return [];
    // Find bounding box
    const xs = lm.map((p) => p.x);
    const ys = lm.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    // Normalize to [0,1] in scan box
    return lm.map((p) => ({
      x: (p.x - minX) / (maxX - minX || 1),
      y: (p.y - minY) / (maxY - minY || 1),
    }));
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto relative">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setShowCamera((prev) => !prev)}
        className="mb-4 px-5 py-2 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-black font-medium hover:shadow-lg transition-all duration-300"
        style={{ alignSelf: 'flex-end' }}
      >
        {showCamera ? 'Show Points Only' : 'Show Camera'}
      </button>
      <PalmScanBox
        isAligned={handInBox && !scanComplete}
        feedbackMsg={feedbackMsg + (timer > 0 && handInBox && !scanComplete ? ` (${timer})` : '')}
        demoMode={demoMode}
        scanning={handInBox && !scanComplete}
        videoElement={
          // Always render the video element for MediaPipe to work
          !demoMode ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-2xl"
              style={{ 
                background: '#10131c', 
                maxHeight: 400, 
                visibility: showCamera ? 'visible' : 'hidden',
                position: showCamera ? 'relative' : 'absolute',
                top: showCamera ? 'auto' : '-9999px'
              }}
            />
          ) : null
        }
        // Pass hand points for points-only mode
        showPointsOnly={!showCamera}
        landmarks={lastLandmarks.current ? getNormalizedLandmarks(lastLandmarks.current) : undefined}
      />
      {/* Progress Bar and Controls */}
      <div className="w-full mt-4 flex flex-col items-center">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="h-2 bg-gradient-to-r from-neon-green to-sky-blue rounded-full" style={{ width: `${Math.round(((TIMER_SECONDS-timer)/TIMER_SECONDS)*100)}%` }} />
        </div>
        {error && (
          <div className="mt-2 p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-2">
            {error}
          </div>
        )}
        {backendMsg && requestStatus === 'success' && (
          <div className="mt-2 p-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-2">
            {backendMsg}
          </div>
        )}
        {requestStatus === 'loading' && (
          <div className="mt-2 p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center gap-2">
            Processing scan...
          </div>
        )}
        {showRetry && requestStatus === 'error' && (
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-neon-green to-sky-blue text-black font-medium hover:shadow-lg transition-all duration-300"
          >
            Re-register
          </button>
        )}
      </div>
      {/* Return Button at the bottom center */}
      <button
        type="button"
        onClick={onCancel}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-300 z-30"
        style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <span style={{ fontSize: 22, display: 'inline-block', transform: 'translateY(1px)' }}>&larr;</span> <span>Return</span>
      </button>
    </div>
  );
};

export default HandScan; 