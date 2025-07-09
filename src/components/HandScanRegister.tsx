import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, RotateCcw, Camera as CameraIcon, ArrowLeft } from 'lucide-react';
import { registerPalmHash, safeJsonParse } from '../api/palmPayApi';
// @ts-ignore
import { Camera } from '@mediapipe/camera_utils';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const STEADY_TIME = 5000; // ms (5 seconds steady)
// 1. Fix GUIDE_BOX for 320x240 canvas
const VIDEO_WIDTH = 400;
const VIDEO_HEIGHT = 300;
// Centered, larger guide box (proportional)
const GUIDE_BOX = {
  x: Math.round(VIDEO_WIDTH * 0.083), // 33
  y: Math.round(VIDEO_HEIGHT * 0.125), // 37
  w: Math.round(VIDEO_WIDTH * 0.83),   // 332
  h: Math.round(VIDEO_HEIGHT * 0.75)   // 225
};

interface HandScanRegisterProps {
  onCancel?: () => void;
}

const HandScanRegister: React.FC<HandScanRegisterProps> = ({ onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraSelectRef = useRef<HTMLSelectElement>(null);
  
  // State
  const [currentLandmarks, setCurrentLandmarks] = useState<any>(null);
  const [handInBox, setHandInBox] = useState(false);
  const [steadyStart, setSteadyStart] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [handsReady, setHandsReady] = useState(false);
  
  // MediaPipe instances
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  
  const navigate = useNavigate();

  const steadyStartRef = useRef<number | null>(null);
  const handInBoxRef = useRef(false);

  // Normalize landmarks for stable hash (exact copy from HTML)
  function normalizeLandmarks(landmarks: any[]) {
    const base = landmarks[0]; // wrist
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of landmarks) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    const size = Math.max(maxX - minX, maxY - minY) || 1;
    return landmarks.map(p => ({
      x: parseFloat(((p.x - base.x) / size).toFixed(4)),
      y: parseFloat(((p.y - base.y) / size).toFixed(4)),
      z: parseFloat(((p.z - base.z) / size).toFixed(4))
    }));
  }

  // Hash function (exact copy from HTML)
  function hashPalm(landmarks: any[]) {
    const norm = normalizeLandmarks(landmarks);
    const json = JSON.stringify(norm);
    return CryptoJS.SHA256(json).toString();
  }

  // Check if all landmarks are inside the guide box (exact copy from HTML)
  function isHandInBox(landmarks: any[]) {
    if (!landmarks || !canvasRef.current) return false;
    let inside = 0;
    for (const p of landmarks) {
      const x = p.x * canvasRef.current.width;
      const y = p.y * canvasRef.current.height;
      if (
        x >= GUIDE_BOX.x + 4 &&
        x <= GUIDE_BOX.x + GUIDE_BOX.w - 4 &&
        y >= GUIDE_BOX.y + 4 &&
        y <= GUIDE_BOX.y + GUIDE_BOX.h - 4
      ) inside++;
    }
    // Allow up to 3 points outside the box
    return inside >= landmarks.length - 3;
  }

  // Convert normalized landmark to canvas coordinates
  function toCanvas(p: any) {
    if (!canvasRef.current) return { x: 0, y: 0 };
    return {
      x: p.x * canvasRef.current.width,
      y: p.y * canvasRef.current.height
    };
  }

  // Draw guide box and hand skeleton (adapted from HTML)
  function drawOverlay(landmarks: any, handInBox: boolean, progress: number) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw guide box (fully closed, thin border)
    ctx.save();
    let boxColor = '#ff4d4d';
    if (handInBox && progress < 1) boxColor = '#00CFFF'; // blue while timing
    if (handInBox && progress >= 1) boxColor = '#00FFB2'; // green when ready
    ctx.strokeStyle = boxColor;
    ctx.lineWidth = 2; // thin border
    ctx.setLineDash([]); // solid line
    ctx.strokeRect(GUIDE_BOX.x, GUIDE_BOX.y, GUIDE_BOX.w, GUIDE_BOX.h);
    ctx.restore();
    
    // Draw hand skeleton
    if (landmarks) {
      // Draw lines
      const connections = [
        [0,1],[1,2],[2,3],[3,4],      // Thumb
        [0,5],[5,6],[6,7],[7,8],      // Index
        [5,9],[9,10],[10,11],[11,12], // Middle
        [9,13],[13,14],[14,15],[15,16], // Ring
        [13,17],[17,18],[18,19],[19,20], // Pinky
        [0,17] // Palm base
      ];
      ctx.save();
      ctx.strokeStyle = '#00CFFF'; // electric-blue
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      for (const [a, b] of connections) {
        const pa = toCanvas(landmarks[a]);
        const pb = toCanvas(landmarks[b]);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
      ctx.restore();
      
      // Draw points
      ctx.save();
      ctx.fillStyle = '#00FFB2'; // fintech-green
      for (const p of landmarks) {
        const pt = toCanvas(p);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // MediaPipe callback (adapted from HTML)
  function onResults(results: any) {
    let handJustEntered = false;
    let inBox = false;
    let newProgress = 0;
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setCurrentLandmarks(results.multiHandLandmarks[0]);
      inBox = isHandInBox(results.multiHandLandmarks[0]);
      if (inBox && !handInBoxRef.current) handJustEntered = true;
      handInBoxRef.current = inBox;
      setHandInBox(inBox);
      // Print normalized landmarks every frame
      const norm = normalizeLandmarks(results.multiHandLandmarks[0]);
      console.log('[PalmPay] SCAN value (normalized landmarks):', norm);
    } else {
      setCurrentLandmarks(null);
      handInBoxRef.current = false;
      setHandInBox(false);
    }
    
    // Steady hand logic
    if (inBox) {
      if (!steadyStartRef.current || handJustEntered) steadyStartRef.current = Date.now();
      newProgress = Math.min(1, (Date.now() - (steadyStartRef.current || Date.now())) / STEADY_TIME);
      setProgress(newProgress);
      
      // Auto-register when progress reaches 1
      if (newProgress >= 1 && !success && !loading) {
        handleRegister();
      }
    } else {
      steadyStartRef.current = null;
      setProgress(0);
    }
    
    // Draw overlay with latest computed values
    drawOverlay(results.multiHandLandmarks?.[0], inBox, newProgress);
  }

  // Camera setup (adapted from HTML)
  async function startCamera(deviceId?: string) {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
    
    let constraints = {
      video: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        width: { ideal: 400 },
        height: { ideal: 300 }
      },
      audio: false
    };
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCurrentStream(stream);
      setCameraReady(true);
      setError('');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Dynamically load Camera from CDN if not present
      // @ts-ignore
      if (!(window as any).Camera) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      // @ts-ignore
      const CameraClass = (window as any).Camera;
      if (videoRef.current && CameraClass) {
        if (cameraRef.current) cameraRef.current.stop();
        cameraRef.current = new CameraClass(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({image: videoRef.current});
            }
          },
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT
        });
        cameraRef.current.start();
      }
      
    } catch (e: any) {
      setError('Could not access camera: ' + e.message);
      setCameraReady(false);
    }
  }

  // Camera device selection
  async function updateCameraList() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      setCameraDevices(videoDevices);
      
      if (videoDevices.length > 0) {
        startCamera(videoDevices[0].deviceId);
      }
    } catch (e: any) {
      setError('Could not enumerate cameras: ' + e.message);
    }
  }

  // Handle camera selection change
  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    startCamera(event.target.value);
  };

  // Handle registration
  const handleRegister = async () => {
    if (!currentLandmarks || !handInBox || progress < 1) {
      setError('Hold your hand steady in the box for 5 seconds to register.');
      return;
    }

    const user = safeJsonParse(localStorage.getItem('user'), {});
    if (!user || !user.id) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const norm = normalizeLandmarks(currentLandmarks);
      console.log('[PalmPay] Normalized landmarks for registration:', norm);
      const hash = CryptoJS.SHA256(JSON.stringify(norm)).toString();
      console.log('[PalmPay] SUCCESS! Registered value:', norm);
      await registerPalmHash(user.id, hash);
      setSuccess(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Palm registration failed.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle rescan
  const handleRescan = () => {
    setSuccess(false);
    setError('');
    setProgress(0);
    steadyStartRef.current = null;
    setCurrentLandmarks(null);
    handInBoxRef.current = false;
    setHandInBox(false);
  };

  // Cancel handler
  const handleCancel = () => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (onCancel) onCancel();
  };

  // Set canvas size
  const resizeCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.width = VIDEO_WIDTH;
      canvasRef.current.height = VIDEO_HEIGHT;
    }
  };

  // HTML-style: Only start scan after both scripts are loaded and WASM is ready
  useEffect(() => {
    let isMounted = true;
    let cameraInstance: any = null;
    let handsInstance: any = null;
    let firstResults = false;

    async function setupPalmScan() {
      // 1. Load MediaPipe Hands script
      if (!(window as any).Hands) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.min.js';
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      // 2. Load MediaPipe Camera script
      if (!(window as any).Camera) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      // 3. Get camera devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      if (!isMounted) return;
      setCameraDevices(videoDevices);
      // 4. Start camera with first device
      const deviceId = videoDevices[0]?.deviceId;
      const constraints = {
        video: true,
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCurrentStream(stream);
      setCameraReady(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // 5. Setup MediaPipe Hands
      const HandsClass = (window as any).Hands;
      handsInstance = new HandsClass({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      handsInstance.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });
      handsInstance.onResults((results: any) => {
        if (!firstResults) {
          setHandsReady(true);
          firstResults = true;
          console.log('[PalmPay] MediaPipe Hands model loaded and first results received.');
        }
        let inBox = false;
        let newProgress = 0;
        let handJustEntered = false;
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          setCurrentLandmarks(results.multiHandLandmarks[0]);
          inBox = isHandInBox(results.multiHandLandmarks[0]);
          handJustEntered = inBox && !handInBoxRef.current;
          handInBoxRef.current = inBox;
          setHandInBox(inBox); // for UI
          // Print normalized landmarks every frame
          const norm = normalizeLandmarks(results.multiHandLandmarks[0]);
          console.log('[PalmPay] SCAN value (normalized landmarks):', norm);
        } else {
          setCurrentLandmarks(null);
          handInBoxRef.current = false;
          setHandInBox(false);
        }
        // Steady hand logic (use ref for timer)
        if (inBox) {
          if (!steadyStartRef.current || handJustEntered) steadyStartRef.current = Date.now();
          newProgress = Math.min(1, (Date.now() - (steadyStartRef.current || Date.now())) / STEADY_TIME);
          setProgress(newProgress);
          if (newProgress >= 1 && !success && !loading) {
            handleRegister();
          }
        } else {
          steadyStartRef.current = null;
          setProgress(0);
        }
        // Draw overlay with latest computed values
        drawOverlay(results.multiHandLandmarks?.[0], inBox, newProgress);
      });
      handsRef.current = handsInstance;
      // 6. Start MediaPipe Camera
      const CameraClass = (window as any).Camera;
      if (videoRef.current && CameraClass) {
        cameraInstance = new CameraClass(videoRef.current, {
          onFrame: async () => {
            if (handsInstance && videoRef.current) {
              await handsInstance.send({ image: videoRef.current });
            }
          },
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT
        });
        cameraInstance.start();
        cameraRef.current = cameraInstance;
        console.log('[PalmPay] Camera started.');
      }
    }
    setupPalmScan();
    return () => {
      isMounted = false;
      if (cameraInstance) cameraInstance.stop();
      if (handsInstance) handsInstance.close();
      if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line
  }, []);

  // Update progress effect
  useEffect(() => {
    if (handInBox && steadyStart) {
      const newProgress = Math.min(1, (Date.now() - steadyStart) / STEADY_TIME);
      setProgress(newProgress);
    }
  }, [handInBox, steadyStart]);

  return (
    <div className="bg-deep-navy text-text-primary h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-4 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 flex items-center gap-1 px-2 py-1 text-text-secondary hover:text-fintech-green transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium text-base">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">Hand Scan & Verify</h1>
        </div>

        {/* Camera Selection */}
        <div className="mb-2 flex items-center gap-2">
          <label htmlFor="cameraSelect" className="text-text-secondary text-sm">Camera:</label>
          <select
            ref={cameraSelectRef}
            id="cameraSelect"
            onChange={handleCameraChange}
            className="bg-card-bg text-text-primary px-2 py-1 rounded border border-electric-blue/30 text-sm focus:outline-none focus:border-electric-blue"
          >
            {cameraDevices.map((device, idx) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>

        {/* Main Container */}
        <div className="bg-card-bg rounded-xl p-3 shadow-xl">
          {/* Video and Canvas */}
          <div className="relative w-full max-w-[360px] aspect-[3/4] mx-auto mb-2 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              className="absolute inset-0 w-full h-full rounded-lg bg-black object-cover"
            />
            <canvas
              ref={canvasRef}
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              className="absolute inset-0 w-full h-full rounded-lg pointer-events-none"
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-deep-navy rounded mb-2 overflow-hidden">
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
          <div className="flex gap-2 justify-center mb-1">
            {!success ? (
              <button
                onClick={handleRegister}
                disabled={!cameraReady || loading || progress < 1}
                className="bg-electric-blue hover:bg-neon-aqua disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Registering...
                  </>
        ) : (
          <>
                    <CameraIcon size={16} />
                    Register Palm
                  </>
                )}
            </button>
            ) : (
              <button
                onClick={handleRescan}
                className="bg-fintech-green hover:bg-neon-green text-black px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-1"
              >
                <RotateCcw size={16} />
                Scan Again
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-text-secondary text-xs">
            Hold your hand steady inside the green box for 5 seconds to register your palm.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandScanRegister; 