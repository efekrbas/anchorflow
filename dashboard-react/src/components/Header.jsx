import React from 'react';
import { Wallet, Bell, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const Header = ({ address, isConnecting, onConnect }) => {
  const formatAddress = (addr) => {
    if (!addr) return '';
    const strAddr = typeof addr === 'object' ? (addr.publicKey || addr.address || JSON.stringify(addr)) : String(addr);
    if (strAddr.length < 10) return strAddr;
    return `${strAddr.slice(0, 6)}...${strAddr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-900/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white animate-fade-in">Overview</h1>
          <p className="text-sm text-zinc-400 mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Welcome back to AnchorFlow
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-stellar-500 animate-pulse"></span>
          </button>

          {address ? (
            <div className="glass-card flex items-center gap-2 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-sm font-medium text-zinc-200">{formatAddress(address)}</span>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className={clsx(
                "btn-primary flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all",
                isConnecting ? "bg-stellar-600/50 cursor-not-allowed" : "bg-stellar-600 hover:bg-stellar-500 hover:shadow-[0_0_20px_rgba(51,129,255,0.4)] hover:-translate-y-0.5"
              )}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect Freighter
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
