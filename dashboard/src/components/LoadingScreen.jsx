import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-stellar-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative flex items-center justify-center mb-8 z-10">
        <div className="absolute w-24 h-24 border-t-2 border-b-2 border-stellar-500/60 rounded-full animate-spin"></div>
        <div className="absolute w-20 h-20 border-r-2 border-l-2 border-purple-500/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(51,129,255,0.6)] bg-transparent">
          <img src="/logo.jpg" alt="AnchorFlow Logo" className="w-full h-full object-cover" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-stellar-400 to-purple-400 z-10">
        ANCHORFLOW
      </h1>
      
      <div className="mt-6 flex items-center gap-3 text-zinc-600 font-mono text-xs tracking-widest z-10">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-stellar-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 rounded-full bg-stellar-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 rounded-full bg-stellar-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
        <span>INITIALIZING SECURE ENVIRONMENT</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
