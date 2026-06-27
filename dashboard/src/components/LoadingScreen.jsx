import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      { delay: 100, value: 15 },
      { delay: 400, value: 35 },
      { delay: 800, value: 55 },
      { delay: 1200, value: 75 },
      { delay: 1600, value: 90 },
      { delay: 1850, value: 100 },
    ];

    const timers = steps.map(step => 
      setTimeout(() => setProgress(step.value), step.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060a14] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-stellar-600/8 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'float-orb 15s infinite ease-in-out' }}></div>
        <div className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-purple-600/6 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'float-orb-reverse 18s infinite ease-in-out' }}></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stellar-500/3 rounded-full blur-[150px] pointer-events-none"></div>
      </div>

      {/* Orbital Loader */}
      <div className="relative flex items-center justify-center mb-10 z-10">
        {/* Outer orbital ring */}
        <div 
          className="absolute w-28 h-28 rounded-full animate-spin"
          style={{ 
            border: '1.5px solid transparent',
            borderTopColor: 'rgba(51, 129, 255, 0.5)',
            borderRightColor: 'rgba(139, 92, 246, 0.3)',
            animationDuration: '3s',
            filter: 'drop-shadow(0 0 8px rgba(51, 129, 255, 0.3))'
          }}
        ></div>
        {/* Inner orbital ring */}
        <div 
          className="absolute w-22 h-22 rounded-full animate-spin"
          style={{ 
            width: '88px',
            height: '88px',
            border: '1px solid transparent',
            borderBottomColor: 'rgba(139, 92, 246, 0.4)',
            borderLeftColor: 'rgba(51, 129, 255, 0.2)',
            animationDirection: 'reverse', 
            animationDuration: '2s',
            filter: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.3))'
          }}
        ></div>
        {/* Core logo */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(51,129,255,0.4)] bg-transparent relative">
          <img src="/logo.jpg" alt="AnchorFlow Logo" className="w-full h-full object-cover" />
          {/* Pulse overlay */}
          <div className="absolute inset-0 bg-stellar-500/10 animate-pulse rounded-xl"></div>
        </div>
      </div>
      
      {/* Brand Title */}
      <h1 className="text-2xl font-bold tracking-[0.25em] z-10 mb-3 text-scramble-in">
        <span className="text-gradient-stellar">ANCHORFLOW</span>
      </h1>
      
      {/* Progress Bar */}
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden z-10 mb-4">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #3381FF, #8B5CF6)'
          }}
        ></div>
      </div>

      {/* Status Text */}
      <div className="flex items-center gap-3 text-zinc-600 font-mono text-[11px] tracking-widest z-10">
        <div className="flex gap-1.5">
          <span className="w-1 h-1 rounded-full bg-stellar-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1 h-1 rounded-full bg-stellar-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-1 rounded-full bg-stellar-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
        <span className="uppercase">Initializing Secure Environment</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
