import React, { useEffect, useRef } from 'react';
import palmOutline from '../assets/palm-outline.svg';

interface PalmScanBoxProps {
  isAligned: boolean;
  feedbackMsg: string;
  demoMode?: boolean;
  scanning?: boolean;
}

const PalmScanBox: React.FC<PalmScanBoxProps> = ({ isAligned, feedbackMsg, demoMode = false, scanning = false }) => {
  const scanBarRef = useRef<HTMLDivElement>(null);
  // Animate scan bar
  useEffect(() => {
    if (!scanning && !demoMode) return;
    let frame: number;
    let direction = 1;
    let pos = 0;
    const min = 10;
    const max = 220;
    function animate() {
      pos += direction * 2;
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
      {/* Scanning Area */}
      <div className="relative w-full aspect-[3/4] max-w-xs flex items-center justify-center">
        {/* Mask */}
        <div className="absolute inset-0 z-0 rounded-2xl pointer-events-none" style={{background: 'rgba(16,19,28,0.7)'}} />
        {/* Scan Box */}
        <div
          className="absolute left-1/2 top-1/2 z-10 flex items-center justify-center"
          style={{
            width: '240px',
            height: '320px',
            transform: 'translate(-50%, -50%)',
            border: `4px solid ${isAligned ? '#22c55e' : '#ef4444'}`,
            boxShadow: isAligned ? '0 0 16px #22c55e' : '0 0 16px #ef4444',
            borderRadius: '2rem',
            background: 'rgba(16,19,28,0.7)',
          }}
        >
          {/* Palm Outline SVG */}
          <img
            src={palmOutline}
            alt="Palm Outline"
            className="absolute inset-0 w-full h-full object-contain opacity-80 pointer-events-none"
            draggable={false}
          />
          {/* Scanning Bar */}
          {(demoMode || scanning) && (
            <div
              ref={scanBarRef}
              className="absolute left-4 right-4 h-3 rounded bg-gradient-to-r from-sky-400 to-green-400 shadow-lg opacity-90"
              style={{ top: '10px', transition: 'top 0.1s linear' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PalmScanBox; 