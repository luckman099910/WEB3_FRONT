import React, { useRef, useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { SignJWT } from 'jose';
// @ts-ignore
// Remove direct import of Camera
// import { Camera } from '@mediapipe/camera_utils';

const STEADY_TIME = 3000; // ms (3 seconds steady for scan)
const VIDEO_WIDTH = 480;
const VIDEO_HEIGHT = 320;
const GUIDE_BOX = {
  x: Math.round(VIDEO_WIDTH * 0.083),
  y: Math.round(VIDEO_HEIGHT * 0.125),
  w: Math.round(VIDEO_WIDTH * 0.83),
  h: Math.round(VIDEO_HEIGHT * 0.75)
};

interface HandScanProps {
  onSuccess: (scanValue: string) => void;
  onCancel?: () => void;
}

const HandScan: React.FC<HandScanProps> = ({ onSuccess, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [handInBox, setHandInBox] = useState(false);
  const [currentLandmarks, setCurrentLandmarks] = useState<any>(null);
  const steadyStartRef = useRef<number | null>(null);
  const handInBoxRef = useRef(false);
  const cameraRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const [borderAnimPos, setBorderAnimPos] = useState(0);
  const [borderAnimDir, setBorderAnimDir] = useState(1); // 1 = down, -1 = up
  const scanCompletedRef = useRef(false);

  // Utility functions (copied from HandScanRegister)
  function normalizeLandmarks(landmarks: any[]) {
    const base = landmarks[0];
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
  async function hashPalm(landmarks: any[]) {
    const norm = normalizeLandmarks(landmarks);
    const json = JSON.stringify(norm);
    const secret = new TextEncoder().encode('secret');
    return await new SignJWT({ data: json })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);
  }
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
    return inside >= landmarks.length - 3;
  }
  function toCanvas(p: any) {
    if (!canvasRef.current) return { x: 0, y: 0 };
    return {
      x: p.x * canvasRef.current.width,
      y: p.y * canvasRef.current.height
    };
  }
  function drawOverlay(landmarks: any, handInBox: boolean, progress: number, animPos?: number) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // --- Four-corner border with glow ---
    let glowColor = '#fff'; // idle
    if (handInBox && progress < 1) glowColor = '#38bdf8'; // sky blue
    if (handInBox && progress >= 1) glowColor = '#22c55e'; // green
    ctx.save();
    ctx.strokeStyle = glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 16;
    ctx.lineWidth = 5;
    ctx.setLineDash([]);
    const len = Math.max(20, Math.min(GUIDE_BOX.w, GUIDE_BOX.h) * 0.13);
    // Top-left
    ctx.beginPath();
    ctx.moveTo(GUIDE_BOX.x, GUIDE_BOX.y + len);
    ctx.lineTo(GUIDE_BOX.x, GUIDE_BOX.y);
    ctx.lineTo(GUIDE_BOX.x + len, GUIDE_BOX.y);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(GUIDE_BOX.x + GUIDE_BOX.w - len, GUIDE_BOX.y);
    ctx.lineTo(GUIDE_BOX.x + GUIDE_BOX.w, GUIDE_BOX.y);
    ctx.lineTo(GUIDE_BOX.x + GUIDE_BOX.w, GUIDE_BOX.y + len);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(GUIDE_BOX.x, GUIDE_BOX.y + GUIDE_BOX.h - len);
    ctx.lineTo(GUIDE_BOX.x, GUIDE_BOX.y + GUIDE_BOX.h);
    ctx.lineTo(GUIDE_BOX.x + len, GUIDE_BOX.y + GUIDE_BOX.h);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(GUIDE_BOX.x + GUIDE_BOX.w - len, GUIDE_BOX.y + GUIDE_BOX.h);
    ctx.lineTo(GUIDE_BOX.x + GUIDE_BOX.w, GUIDE_BOX.y + GUIDE_BOX.h);
    ctx.lineTo(GUIDE_BOX.x + GUIDE_BOX.w, GUIDE_BOX.y + GUIDE_BOX.h - len);
    ctx.stroke();
    ctx.restore();

    // --- Animated scan line (sky blue) ---
    if (handInBox && progress < 1 && typeof animPos === 'number') {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 4;
      const y = GUIDE_BOX.y + animPos;
      ctx.beginPath();
      ctx.moveTo(GUIDE_BOX.x + 8, y);
      ctx.lineTo(GUIDE_BOX.x + GUIDE_BOX.w - 8, y);
      ctx.stroke();
      ctx.restore();
    }

    // Draw hand skeleton (unchanged)
    if (landmarks) {
      const connections = [
        [0,1],[1,2],[2,3],[3,4],
        [0,5],[5,6],[6,7],[7,8],
        [5,9],[9,10],[10,11],[11,12],
        [9,13],[13,14],[14,15],[15,16],
        [13,17],[17,18],[18,19],[19,20],
        [0,17]
      ];
      ctx.save();
      ctx.strokeStyle = '#00CFFF';
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
      ctx.save();
      ctx.fillStyle = '#00FFB2';
      for (const p of landmarks) {
        const pt = toCanvas(p);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Camera setup (robust, simple, no camera selection)
  useEffect(() => {
    let isMounted = true;
    let cameraInstance: any = null;
    let handsInstance: any = null;
    setLoading(true);
    setError('');
    setProgress(0);
    steadyStartRef.current = null;
    handInBoxRef.current = false;
    scanCompletedRef.current = false; // Reset on component mount
    async function setupPalmScan() {
      try {
        // 1. Load MediaPipe Hands script if not present
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
        // 2. Load MediaPipe Camera script if not present
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
        // 3. Get camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT }, audio: false });
        setCurrentStream(stream);
        setCameraReady(true);
        setError('');
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // 4. Setup MediaPipe Hands
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
        handsInstance.onResults(onResults);
        handsRef.current = handsInstance;
        // 5. Start MediaPipe Camera
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
        }
        setLoading(false);
      } catch (e: any) {
        setError('Could not access camera: ' + (e.message || e));
        setCameraReady(false);
        setLoading(false);
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

  // Animation loop for border effect
  useEffect(() => {
    if (handInBox && progress < 1) {
      let direction = 1;
      let pos = 0;
      const min = 0;
      const max = GUIDE_BOX.h - 8;
      const duration = 500; // ms for a full cycle (top to bottom or bottom to top)
      let lastTimestamp = performance.now();
      function animate(now: number) {
        const elapsed = now - lastTimestamp;
        lastTimestamp = now;
        // Calculate how much to move per ms
        const delta = ((max - min) / duration) * elapsed;
        pos += direction * delta;
        if (pos >= max) {
          pos = max;
          direction = -1;
        } else if (pos <= min) {
          pos = min;
          direction = 1;
        }
        setBorderAnimPos(pos);
        animationRef.current = requestAnimationFrame(animate);
      }
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    } else {
      setBorderAnimPos(0);
    }
  }, [handInBox, progress]);

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
    } else {
      setCurrentLandmarks(null);
      handInBoxRef.current = false;
      setHandInBox(false);
    }
    if (inBox) {
      if (!steadyStartRef.current || handJustEntered) steadyStartRef.current = Date.now();
      newProgress = Math.min(1, (Date.now() - (steadyStartRef.current || Date.now())) / STEADY_TIME);
      setProgress(newProgress);
      if (newProgress >= 1 && !scanCompletedRef.current) {
        scanCompletedRef.current = true;
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          hashPalm(results.multiHandLandmarks[0]).then(scanValue => {
            setTimeout(() => {
              onSuccess(scanValue);
            }, 300);
          });
        }
      }
    } else {
      steadyStartRef.current = null;
      setProgress(0);
      scanCompletedRef.current = false; // Reset when hand leaves box
    }
    drawOverlay(results.multiHandLandmarks?.[0], inBox, newProgress, borderAnimPos);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-light text-white mb-2">Hand Scan</h2>
        <p className="text-white/70">Place your palm in the box and hold steady</p>
      </div>
      <div className="relative w-full flex flex-col items-center justify-center bg-black rounded-2xl shadow-lg overflow-hidden mb-4" style={{ aspectRatio: '3/2', maxWidth: 640 }}>
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
          style={{ aspectRatio: '3/2', maxWidth: '100%' }}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ aspectRatio: '3/2', maxWidth: '100%' }}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
        />
        {(!cameraReady || loading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-xl">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>
      <div className="w-full mt-4 flex flex-col items-center">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="h-2 bg-gradient-to-r from-neon-green to-sky-blue rounded-full" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        {error && (
          <div className="mt-2 p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
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