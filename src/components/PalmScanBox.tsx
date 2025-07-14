import React, { useEffect, useRef } from 'react';
import palmOutline from '../assets/palm-outline.svg';

interface PalmScanBoxProps {
  isAligned: boolean;
  feedbackMsg: string;
  demoMode?: boolean;
  scanning?: boolean;
  videoElement?: React.ReactNode; // New prop for video
}

const PalmScanBox: React.FC<PalmScanBoxProps> = ({ isAligned, feedbackMsg, demoMode = false, scanning = false, videoElement }) => {
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
        {videoElement && (
          <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
            {videoElement}
          </div>
        )}
        {/* Mask overlay */}
        <div className="absolute inset-0 z-10 rounded-2xl pointer-events-none" style={{background: 'rgba(16,19,28,0.5)'}} />
        {/* Scan Box border */}
        <div
          className="absolute left-1/2 top-1/2 z-20 flex items-center justify-center"
          style={{
            width: '320px',
            height: '400px',
            transform: 'translate(-50%, -50%)',
            border: `4px solid ${isAligned ? '#22c55e' : '#ef4444'}`,
            boxShadow: isAligned ? '0 0 24px #22c55e' : '0 0 24px #ef4444',
            borderRadius: '2rem',
            background: 'rgba(16,19,28,0.2)',
          }}
        >
          {/* Palm Outline SVG (larger) */}
          <img
            src={palmOutline}
            alt="Palm Outline"
            className="absolute inset-0 w-[90%] h-[90%] object-contain opacity-90 pointer-events-none mx-auto my-auto"
            draggable={false}
            style={{ left: '5%', top: '5%' }}
          />
          {/* Scanning Bar (only if isAligned) */}
          {isAligned && (
            <div
              ref={scanBarRef}
              className="absolute left-6 right-6 h-4 rounded bg-gradient-to-r from-sky-400 to-blue-400 shadow-lg opacity-90"
              style={{ top: '10px', transition: 'top 0.1s linear' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PalmScanBox; 