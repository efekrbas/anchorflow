import React, { useState, useRef, useEffect } from 'react';
import { Wallet, Bell, Loader2, LogOut, Menu, Check } from 'lucide-react';
import clsx from 'clsx';

const Header = ({ address, isConnecting, onConnect, onDisconnect, onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(() => {
    return localStorage.getItem('anchorflow_notifications_read') !== 'true';
  });
  const notificationRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    if (!address) return;
    const strAddr = typeof address === 'object' ? (address.publicKey || address.address || '') : String(address);
    navigator.clipboard.writeText(strAddr);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    const strAddr = typeof addr === 'object' ? (addr.publicKey || addr.address || JSON.stringify(addr)) : String(addr);
    if (strAddr.length < 10) return strAddr;
    return `${strAddr.slice(0, 6)}...${strAddr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-900/50 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 -ml-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4 ml-auto">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && hasUnread) {
                  setHasUnread(false);
                  localStorage.setItem('anchorflow_notifications_read', 'true');
                }
              }}
              className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-stellar-500 animate-pulse"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 glass-card border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-fade-in z-50">
                <div className="p-4 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                <div className="p-2 max-h-[300px] overflow-y-auto">
                  <div className="p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                    <p className="text-sm text-zinc-300">Welcome to AnchorFlow!</p>
                    <p className="text-xs text-zinc-500 mt-1">Connect your wallet to get started.</p>
                  </div>
                  <div className="p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                    <p className="text-sm text-zinc-300">System Update</p>
                    <p className="text-xs text-zinc-500 mt-1">Testnet is running smoothly.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {address ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                className="glass-card flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition-colors group cursor-pointer"
                title="Copy Address"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:shadow-[0_0_12px_rgba(34,197,94,0.8)] transition-shadow"></div>
                )}
                <span className={clsx("text-sm font-medium transition-colors", isCopied ? "text-emerald-400" : "text-zinc-200")}>
                  {isCopied ? "Copied" : formatAddress(address)}
                </span>
              </button>
              <button 
                onClick={onDisconnect}
                className="p-2 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                title="Disconnect"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
