import React, { useEffect, useRef } from 'react';
import handPng from '../assets/hand.png';

interface PalmScanBoxProps {
  isAligned: boolean;
  feedbackMsg: string;
  demoMode?: boolean;
  scanning?: boolean;
  videoElement?: React.ReactNode;
}

const PalmScanBox: React.FC<PalmScanBoxProps> = ({ isAligned, feedbackMsg, demoMode = false, scanning = false, videoElement }) => {
  const scanBarRef = useRef<HTMLDivElement>(null);
  const lightEffectRef = useRef<HTMLDivElement>(null);
  
  // Enhanced scan bar animation with blue light effect
  useEffect(() => {
    if (!isAligned || demoMode) return;
    let frame: number;
    let direction = 1;
    let pos = 10;
    const min = 10;
    const max = 280;
    
    function animate() {
      pos += direction * 4; // Slower movement for better effect
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
  }, [isAligned, demoMode]);

  // Blue light effect animation
  useEffect(() => {
    if (!isAligned || demoMode) return;
    let frame: number;
    let opacity = 0.3;
    let direction = 1;
    
    function animateLight() {
      opacity += direction * 0.02;
      if (opacity >= 0.8) {
        opacity = 0.8;
        direction = -1;
      } else if (opacity <= 0.3) {
        opacity = 0.3;
        direction = 1;
      }
      if (lightEffectRef.current) {
        lightEffectRef.current.style.opacity = opacity.toString();
      }
      frame = requestAnimationFrame(animateLight);
    }
    animateLight();
    return () => cancelAnimationFrame(frame);
  }, [isAligned, demoMode]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-md mx-auto">
      {/* Feedback Text - Green when scanning, red/green based on alignment */}
      <div className={`mb-2 text-lg font-medium transition-colors duration-300 ${
        scanning && isAligned 
          ? 'text-green-400 animate-pulse' 
          : isAligned 
            ? 'text-green-400' 
            : 'text-red-400'
      }`}>
        {feedbackMsg}
      </div>
      
      {/* Scanning Area (scan box) */}
      <div className="relative w-full aspect-[3/4] max-w-xs flex items-center justify-center" style={{height: 400}}>
        {/* Video feed inside scan box, behind everything */}
        {videoElement && (
          <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
            {videoElement}
          </div>
        )}
        
        {/* Blur effect outside palm SVG but inside scan box */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{
          filter: 'blur(6px)',
          background: 'rgba(16,19,28,0.5)',
          maskImage: 'radial-gradient(circle at 50% 50%, transparent 60%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 60%, black 100%)',
          borderRadius: '2rem',
        }} />
        
        {/* Blue light effect overlay */}
        {isAligned && (
          <div
            ref={lightEffectRef}
            className="absolute inset-0 z-25 pointer-events-none rounded-2xl"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
              opacity: 0.3,
            }}
          />
        )}
        
        {/* Scan Box border - Enhanced with better effects */}
        <div
          className="absolute inset-0 z-30 flex items-center justify-center transition-all duration-300"
          style={{
            border: `4px solid ${isAligned ? '#22c55e' : '#ef4444'}`,
            boxShadow: isAligned 
              ? '0 0 24px #22c55e, 0 0 48px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.1)' 
              : '0 0 24px #ef4444',
            borderRadius: '2rem',
            background: isAligned ? 'rgba(34, 197, 94, 0.05)' : 'rgba(16,19,28,0.2)',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Palm Outline SVG (fill 98% of scan box) */}
          <img
            src={handPng}
            alt="Palm Outline"
            className={`absolute object-contain opacity-90 pointer-events-none mx-auto my-auto transition-all duration-300 ${
              isAligned ? 'filter brightness-110' : ''
            }`}
            draggable={false}
            style={{ width: '98%', height: '98%', left: '1%', top: '1%' }}
          />
          
          {/* Enhanced Scanning Bar with blue light effect */}
          {isAligned && (
            <div
              ref={scanBarRef}
              className="absolute left-[1%] right-[1%] h-3 rounded-full shadow-lg"
              style={{
                top: '10px',
                width: '98%',
                background: 'linear-gradient(90deg, transparent 0%, #60a5fa 20%, #3b82f6 50%, #60a5fa 80%, transparent 100%)',
                border: '2px solid #60a5fa',
                boxShadow: '0 0 20px 6px #38bdf8, 0 0 40px 12px #60a5fa, inset 0 0 10px rgba(59, 130, 246, 0.3)',
                filter: 'blur(0.5px) brightness(1.2)',
                transition: 'top 0.1s linear',
                opacity: 1,
              }}
            />
          )}
          
          {/* Additional scanning lines for enhanced effect */}
          {isAligned && (
            <>
              <div
                className="absolute left-[1%] right-[1%] h-1 rounded-full opacity-60"
                style={{
                  top: '50px',
                  width: '98%',
                  background: 'linear-gradient(90deg, transparent 0%, #38bdf8 50%, transparent 100%)',
                  boxShadow: '0 0 10px #38bdf8',
                }}
              />
              <div
                className="absolute left-[1%] right-[1%] h-1 rounded-full opacity-40"
                style={{
                  top: '100px',
                  width: '98%',
                  background: 'linear-gradient(90deg, transparent 0%, #38bdf8 50%, transparent 100%)',
                  boxShadow: '0 0 8px #38bdf8',
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PalmScanBox; 