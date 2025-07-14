import React, { useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SignJWT } from 'jose';
import PalmScanBox from './PalmScanBox';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLandmarks = useRef<any>(null);
  const sentRef = useRef(false);

  // Camera and MediaPipe Hands setup
  useEffect(() => {
    if (demoMode) {
      setLoading(false);
      return;
    }
    setLoading(true);
    let hands: Hands | null = null;
    let camera: Camera | null = null;
    let stopped = false;

    async function setup() {
      hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });
      hands.onResults((results) => {
        if (stopped) return;
        const lm = results.multiHandLandmarks && results.multiHandLandmarks[0];
        // Check if hand is in the center and roughly matches the scan box
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
          await hands!.send({ image: videoRef.current! });
        },
        width: 640,
        height: 480,
      });
      camera.start();
      setLoading(false);
      console.log('[PalmScan] Camera and MediaPipe Hands started.');
    }
    setup();
    return () => {
      stopped = true;
      if (camera) camera.stop();
      if (hands) hands.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
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

  // When timer reaches 0 and hand is still in box, capture and send
  useEffect(() => {
    if (scanComplete || demoMode) return;
    if (timer === 0 && handInBox && lastLandmarks.current && !sentRef.current) {
      doScan(lastLandmarks.current);
    }
  }, [timer, handInBox, scanComplete, demoMode]);

  async function doScan(landmarks: any) {
    setScanComplete(true);
    setScanning(false);
    setFeedbackMsg('Scanning...');
    sentRef.current = true;
    try {
      // Sign landmarks as JWT
      const payload = JSON.stringify(landmarks);
      const jwt = await new SignJWT({ data: payload })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(new TextEncoder().encode(HAND_SCAN_SECRET));
      setFeedbackMsg('Scan complete! Sending...');
      console.log('[PalmScan] Scan complete. JWT:', jwt);
      // Example: send to backend (replace with your API call)
      // You can use onSuccess(jwt) to trigger parent logic
      const res = await fetch('/api/registerPalm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'USER_ID', handinfo: jwt }), // Replace USER_ID
      });
      const data = await res.json();
      setBackendMsg(data.message || JSON.stringify(data));
      console.log('[PalmScan] Backend response:', data);
      onSuccess(jwt); // Optionally call parent
    } catch (err: any) {
      setError('Scan failed: ' + err.message);
      setScanComplete(false);
      sentRef.current = false;
      console.error('[PalmScan] Error:', err);
    }
  }

  // Hand alignment check (basic: hand center in box, hand size reasonable)
  function isHandAligned(lm: any[]): boolean {
    // Get bounding box
    const xs = lm.map((p) => p.x);
    const ys = lm.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    // Center and size thresholds (tweak as needed)
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX;
    const height = maxY - minY;
    // Center should be near 0.5,0.5; size should be reasonable
    const aligned = (
      centerX > 0.4 && centerX < 0.6 &&
      centerY > 0.4 && centerY < 0.6 &&
      width > 0.3 && width < 0.7 &&
      height > 0.3 && height < 0.7
    );
    if (aligned) console.log('[PalmScan] Hand is aligned.');
    return aligned;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <PalmScanBox
        isAligned={handInBox && !scanComplete}
        feedbackMsg={feedbackMsg + (timer > 0 && handInBox && !scanComplete ? ` (${timer})` : '')}
        demoMode={demoMode}
        scanning={handInBox && !scanComplete}
        videoElement={
          !demoMode ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-2xl"
              style={{ background: '#10131c', maxHeight: 400 }}
            />
          ) : null
        }
      />
      {/* Progress Bar */}
      <div className="w-full mt-4 flex flex-col items-center">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="h-2 bg-gradient-to-r from-neon-green to-sky-blue rounded-full" style={{ width: `${Math.round(((TIMER_SECONDS-timer)/TIMER_SECONDS)*100)}%` }} />
        </div>
        {error && (
          <div className="mt-2 p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-2">
            {error}
          </div>
        )}
        {backendMsg && (
          <div className="mt-2 p-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-2">
            {backendMsg}
          </div>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 px-6 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-300"
          disabled={scanComplete}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default HandScan; 