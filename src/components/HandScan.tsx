import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
// @ts-ignore
import { Camera } from '@mediapipe/camera_utils';
import CryptoJS from 'crypto-js';

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
  function hashPalm(landmarks: any[]) {
    const norm = normalizeLandmarks(landmarks);
    const json = JSON.stringify(norm);
    return CryptoJS.SHA256(json).toString();
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
  function drawOverlay(landmarks: any, handInBox: boolean, progress: number) {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.save();
    let boxColor = '#ff4d4d';
    if (handInBox && progress < 1) boxColor = '#00CFFF';
    if (handInBox && progress >= 1) boxColor = '#00FFB2';
    ctx.strokeStyle = boxColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(GUIDE_BOX.x, GUIDE_BOX.y, GUIDE_BOX.w, GUIDE_BOX.h);
    ctx.restore();
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

  // MediaPipe hand scan logic
  useEffect(() => {
    let hands: any;
    let camera: any;
    let isMounted = true;
    setLoading(true);
    setError('');
    setProgress(0);
    steadyStartRef.current = null;
    handInBoxRef.current = false;
    import('@mediapipe/hands').then(({ Hands }) => {
      if (!isMounted) return;
      hands = new Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });
      hands.onResults(onResults);
      handsRef.current = hands;
      if (videoRef.current) {
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current });
          },
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT
        });
        cameraRef.current = camera;
        camera.start().then(() => setCameraReady(true)).catch(() => setError('Camera error'));
      }
    });
    return () => {
      isMounted = false;
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
    };
    // eslint-disable-next-line
  }, []);

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
      if (newProgress >= 1) {
        // Auto-complete scan
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const scanValue = hashPalm(results.multiHandLandmarks[0]);
          setTimeout(() => {
            onSuccess(scanValue);
          }, 300); // slight delay for UI
        }
      }
    } else {
      steadyStartRef.current = null;
      setProgress(0);
    }
    drawOverlay(results.multiHandLandmarks?.[0], inBox, newProgress);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-light text-white mb-2">Hand Scan</h2>
        <p className="text-white/70">Place your palm in the box and hold steady</p>
      </div>
      <div className="relative">
        <video ref={videoRef} width={VIDEO_WIDTH} height={VIDEO_HEIGHT} className="rounded-xl bg-black" style={{ display: cameraReady ? 'block' : 'none' }} />
        <canvas ref={canvasRef} width={VIDEO_WIDTH} height={VIDEO_HEIGHT} className="absolute top-0 left-0 pointer-events-none rounded-xl" />
        {!cameraReady && (
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