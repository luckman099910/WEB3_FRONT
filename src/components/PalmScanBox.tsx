import React, { useEffect, useRef } from 'react';
import handPng from '../assets/hand.png';

interface PalmScanBoxProps {
  isAligned: boolean;
  feedbackMsg: string;
  demoMode?: boolean;
  scanning?: boolean;
  videoElement?: React.ReactNode; // New prop for video
  showPalmImage?: boolean; // NEW: control palm image rendering
  landmarks?: Array<{ x: number; y: number }>; // NEW: hand landmarks for points-only mode
  showPointsOnly?: boolean; // NEW: toggle for points-only mode
}

const PalmScanBox: React.FC<PalmScanBoxProps> = ({ isAligned, feedbackMsg, demoMode = false, scanning = false, videoElement, showPalmImage = true, landmarks, showPointsOnly }) => {
  const scanBarRef = useRef<HTMLDivElement>(null);
  // Animate scan bar (only if scanning and not registration)
  useEffect(() => {
    if (!scanning || demoMode) return;
    let frame: number;
    let direction = 1;
    let pos = 10;
    const min = 10;
    const max = 280;
    function animate() {
      pos += direction * 6;
      if (pos >= max) {
        pos = max;
        direction = -1;
      } else if (pos <= min) {
        pos = min;
        direction = 1;
      }
      if (scanBarRef.current) {
        scanBarRef.current.style.top = `${pos}px`;
      }
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [scanning, demoMode]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-md mx-auto">
      {/* Feedback Text */}
      <div className={`mb-2 text-lg font-medium ${isAligned ? 'text-green-400' : 'text-red-400'}`}>{feedbackMsg}</div>
      {/* Scanning Area (scan box) */}
      <div className="relative w-full aspect-[3/4] max-w-xs flex items-center justify-center" style={{height: 400}}>
        {/* Video feed inside scan box, behind everything */}
        {videoElement && !showPointsOnly && (
          <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
            {videoElement}
          </div>
        )}
        {/* Points-only mode: render hand landmarks as SVG dots */}
        {showPointsOnly && landmarks && (
          <svg className="absolute inset-0 z-40" width="100%" height="100%" viewBox="0 0 1 1" style={{ width: '100%', height: '100%' }}>
            {landmarks.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={0.015} fill="#2d8cff" stroke="#fff" strokeWidth={0.005} />
            ))}
          </svg>
        )}
        {/* Blur effect outside palm SVG but inside scan box */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{
          filter: 'blur(6px)',
          background: 'rgba(16,19,28,0.5)',
          maskImage: 'radial-gradient(circle at 50% 50%, transparent 60%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 60%, black 100%)',
          borderRadius: '2rem',
        }} />
        {/* Scan Box border - now matches video area exactly */}
        <div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{
            border: `4px solid ${isAligned ? '#22c55e' : '#ef4444'}`,
            boxShadow: isAligned ? '0 0 24px #22c55e' : '0 0 24px #ef4444',
            borderRadius: '2rem',
            background: 'rgba(16,19,28,0.2)',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Palm Outline SVG (fill 98% of scan box) */}
          {showPalmImage && !showPointsOnly && (
            <img
              src={handPng}
              alt="Palm Outline"
              className="absolute object-contain opacity-90 pointer-events-none mx-auto my-auto"
              draggable={false}
              style={{ width: '98%', height: '98%', left: '1%', top: '1%' }}
            />
          )}
          {/* Scanning Bar (only if isAligned, 98% width, matches box edges) */}
          {isAligned && (
            <div
              ref={scanBarRef}
              className="absolute left-[1%] right-[1%] h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-400 shadow-lg opacity-90"
              style={{
                top: '10px',
                width: '98%',
                border: '2px solid #60a5fa',
                boxShadow: '0 0 16px 4px #38bdf8, 0 0 32px 8px #60a5fa',
                filter: 'blur(0.5px) brightness(1.5)',
                transition: 'top 0.1s linear',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PalmScanBox; 