import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, RotateCcw, Camera, X } from 'lucide-react';
import { api } from '../api/palmPayApi';
import { safeJsonParse } from '../api/palmPayApi';
// @ts-ignore
import { Hands } from '@mediapipe/hands';
// @ts-ignore
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const INSPECTION_TIME = 4000; // ms

interface HandScanRegisterProps {
  onCancel?: () => void;
}

const HandScanRegister: React.FC<HandScanRegisterProps> = ({ onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [handData, setHandData] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [captureStarted, setCaptureStarted] = useState(false);
  const [handInRegion, setHandInRegion] = useState(false);
  const [landmarks, setLandmarks] = useState<any[]>([]);

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

  // Hand detection setup
  useEffect(() => {
    let hands: any;
    let animationId: number;
    let video: HTMLVideoElement | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;

    const setupHandDetection = async () => {
      // @ts-ignore
      const HandsModule = (await import('@mediapipe/hands')).Hands;
      hands = new HandsModule({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });
      hands.onResults(onResults);

      video = videoRef.current;
      canvas = canvasRef.current;
      if (!video || !canvas) return;
      ctx = canvas.getContext('2d');

      const detect = async () => {
        if (video && video.readyState === 4) {
          await hands.send({ image: video });
        }
        animationId = requestAnimationFrame(detect);
      };
      detect();
    };

    const onResults = (results: any) => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const handLandmarks = results.multiHandLandmarks[0];
        setLandmarks(handLandmarks);
        // Draw landmarks and connectors
        drawConnectors(ctx, handLandmarks, Hands.HAND_CONNECTIONS, { color: '#00FFAA', lineWidth: 4 });
        drawLandmarks(ctx, handLandmarks, { color: '#00FFAA', lineWidth: 2 });
        // Check if all points are within the central region
        const confined = handLandmarks.every((pt: any) =>
          pt.x > 0.1 && pt.x < 0.9 && pt.y > 0.1 && pt.y < 0.9
        );
        setHandInRegion(confined);
        // Draw border
        ctx.save();
        ctx.strokeStyle = confined ? '#00FFAA' : '#FF4444';
        ctx.lineWidth = 6;
        ctx.beginPath();
        handLandmarks.forEach((pt: any, i: number) => {
          const x = pt.x * canvasRef.current!.width;
          const y = pt.y * canvasRef.current!.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      } else {
        setLandmarks([]);
        setHandInRegion(false);
      }
    };

    if (cameraReady) {
      setupHandDetection();
    }
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (hands && hands.close) hands.close();
    };
    // eslint-disable-next-line
  }, [cameraReady]);

  // Simulate hand detection and start capture
  const handleStartCapture = () => {
    setCaptureStarted(true);
    setError('');
    setProgress(0);
    setScanning(true);
    let elapsed = 0;
    const interval = 100;
    const timer = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min(100, (elapsed / INSPECTION_TIME) * 100));
      if (elapsed >= INSPECTION_TIME) {
        clearInterval(timer);
        if (!handInRegion) {
          setError('Please keep your hand inside the border.');
          setScanning(false);
          setCaptureStarted(false);
          stopCamera();
          return;
        }
        // Simulate image quality check (random fail for 'too dark' or 'blurry')
        const isQualityGood = Math.random() > 0.15;
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
      const user = safeJsonParse(localStorage.getItem('user'), {});
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
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Start camera on mount
  useEffect(() => {
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
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover absolute top-0 left-0" />
                <canvas ref={canvasRef} width={480} height={360} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
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