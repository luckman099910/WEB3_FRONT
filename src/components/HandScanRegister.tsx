import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, RotateCcw, Camera, X } from 'lucide-react';
import { api } from '../api/palmPayApi';
import { safeJsonParse } from '../api/palmPayApi';
// @ts-ignore
import { Hands } from '@mediapipe/hands';
// @ts-ignore
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const INSPECTION_TIME = 4000; // ms
const FRAME_COLOR = '#00FFAA';
const FRAME_LINE_WIDTH = 4;
const DOT_COLOR = '#00FFAA';
const DOT_RADIUS = 6;
const SCAN_LINE_COLOR = '#00FFAA';
const SCAN_LINE_WIDTH = 3;
const FRAME_ANIMATION_DURATION = 500; // ms

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
  // Add scanning line animation state
  const [scanLineY, setScanLineY] = useState(0);
  const [frameColor, setFrameColor] = useState(FRAME_COLOR);
  const [framePulse, setFramePulse] = useState(false);

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

  // Cancel handler (restored)
  const handleCancel = () => {
    stopCamera();
    setScanning(false);
    setProgress(0);
    setError('');
    setSuccess(false);
    setHandData('');
    setCaptureStarted(false);
    setHandInRegion(false);
    setLandmarks([]);
    setScanLineY(0);
    setFrameColor(FRAME_COLOR);
    setFramePulse(false);
    if (onCancel) onCancel();
  };

  // Animate scanning line when scanning and hand is in region
  useEffect(() => {
    let scanLineAnimId: number;
    if (scanning && handInRegion && canvasRef.current) {
      let y = 50;
      let direction = 1;
      function animate() {
        setScanLineY(y);
        y += direction * 4;
        if (y > canvasRef.current!.height - 50) direction = -1;
        if (y < 50) direction = 1;
        scanLineAnimId = requestAnimationFrame(animate);
      }
      animate();
      return () => cancelAnimationFrame(scanLineAnimId);
    } else {
      setScanLineY(0);
    }
  }, [scanning, handInRegion]);

  // Hand detection setup
  useEffect(() => {
    let hands: any;
    let animationId: number;
    let video: HTMLVideoElement | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;

    // Helper to draw the neon frame (update to use frameColor and pulse)
    function drawFrame(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.save();
      ctx.strokeStyle = frameColor;
      ctx.shadowColor = frameColor;
      ctx.shadowBlur = framePulse ? 32 : 16;
      ctx.lineWidth = FRAME_LINE_WIDTH + (framePulse ? 4 : 0);
      ctx.strokeRect(40, 40, width - 80, height - 80);
      ctx.restore();
      // Draw red hand scan border (fixed margin inside neon frame)
      ctx.save();
      ctx.strokeStyle = 'red';
      ctx.shadowColor = 'red';
      ctx.shadowBlur = 0;
      ctx.lineWidth = 3;
      ctx.strokeRect(70, 70, width - 140, height - 140);
      ctx.restore();
    }

    // Helper to draw hand landmarks as dots
    function drawLandmarkDots(ctx: CanvasRenderingContext2D, handLandmarks: any[]) {
      ctx.save();
      ctx.fillStyle = DOT_COLOR;
      ctx.shadowColor = DOT_COLOR;
      ctx.shadowBlur = 12;
      handLandmarks.forEach(pt => {
        const x = pt.x * ctx.canvas.width;
        const y = pt.y * ctx.canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.restore();
    }

    // Helper to draw scanning line
    function drawScanLine(ctx: CanvasRenderingContext2D, y: number, width: number) {
      ctx.save();
      ctx.strokeStyle = SCAN_LINE_COLOR;
      ctx.shadowColor = SCAN_LINE_COLOR;
      ctx.shadowBlur = 16;
      ctx.lineWidth = SCAN_LINE_WIDTH;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 40, y);
      ctx.stroke();
      ctx.restore();
    }

    const setupHandDetection = async () => {
      // @ts-ignore
      const HandsModule = await import('@mediapipe/hands');
      hands = new HandsModule.default.Hands({
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
      // Always draw the neon frame
      drawFrame(ctx, canvasRef.current.width, canvasRef.current.height);
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const handLandmarks = results.multiHandLandmarks[0];
        setLandmarks(handLandmarks);
        // Debug: Output hand scan result to console
        console.log('[HandScan] Landmarks:', handLandmarks);
        // Draw landmarks and connectors (optional, can comment out for just dots)
        // drawConnectors(ctx, handLandmarks, Hands.HAND_CONNECTIONS, { color: '#00FFAA', lineWidth: 4 });
        // drawLandmarks(ctx, handLandmarks, { color: '#00FFAA', lineWidth: 2 });
        // Draw glowing dots for each landmark
        drawLandmarkDots(ctx, handLandmarks);
        // Check if all points are within the central region
        const confined = handLandmarks.every((pt: any) =>
          pt.x > 0.1 && pt.x < 0.9 && pt.y > 0.1 && pt.y < 0.9
        );
        setHandInRegion(confined);
        // If scanning and hand is in region, draw scanning line
        if (scanning && confined) {
          drawScanLine(ctx, scanLineY, canvasRef.current.width);
        }
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
  }, [cameraReady, frameColor, framePulse, scanLineY, scanning]);

  // Animate frame color based on handInRegion
  useEffect(() => {
    let colorAnimId: number;
    let t = 0;
    if (!success) {
      function animateColor() {
        if (handInRegion) {
          setFrameColor(FRAME_COLOR);
        } else {
          // Animate between neon green and red
          t += 0.05;
          const r = Math.round(255 * Math.abs(Math.sin(t)));
          setFrameColor(`rgb(${r},255,170)`); // animate between red and green
        }
        colorAnimId = requestAnimationFrame(animateColor);
      }
      animateColor();
      return () => cancelAnimationFrame(colorAnimId);
    }
  }, [handInRegion, success]);

  // Pulse effect on success
  useEffect(() => {
    if (success) {
      setFramePulse(true);
      const timeout = setTimeout(() => setFramePulse(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [success]);

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

  // Start camera on mount and clean up on unmount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full flex justify-center items-center min-h-[70vh]">
      <div className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 max-w-2xl w-full flex flex-col items-center shadow-2xl">
        <h2 className="text-4xl font-light text-primary mb-10 text-center">Palm Registration</h2>
        {/* Registration UI always shown */}
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
            </div>
                <div className="flex flex-row gap-4 w-full mt-4">
                  <button
                    onClick={handleRescan}
                    className="flex-1 px-8 py-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium flex items-center justify-center gap-2 text-lg border border-white/30 hover:bg-blue-700 transition"
                  >
                    <RotateCcw className="w-6 h-6" /> Rescan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-8 py-4 rounded-full border-2 border-red-500 text-red-500 font-medium flex items-center justify-center gap-2 text-lg bg-transparent hover:bg-red-500 hover:text-white transition"
                  >
                    <X className="w-6 h-6" /> Cancel
                  </button>
                </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HandScanRegister; 