import React, { useState } from 'react';
import { Wallet, Bell, Loader2, LogOut, Menu, Check } from 'lucide-react';
import clsx from 'clsx';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = ({ address, isConnecting, onConnect, onDisconnect, onToggleSidebar, network }) => {
  const [hasUnread, setHasUnread] = useState(() => {
    return localStorage.getItem('anchorflow_notifications_read') !== 'true';
  });

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

  const handleNotificationOpenChange = (open) => {
    if (open && hasUnread) {
      setHasUnread(false);
      localStorage.setItem('anchorflow_notifications_read', 'true');
    }
  };

  const networkColor = {
    'Mainnet': { dot: 'bg-emerald-500', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.8)]', text: 'text-emerald-400' },
    'Testnet': { dot: 'bg-stellar-500', glow: 'shadow-[0_0_10px_rgba(51,129,255,0.8)]', text: 'text-stellar-400' },
    'Futurenet': { dot: 'bg-amber-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.8)]', text: 'text-amber-400' },
  }[network] || { dot: 'bg-zinc-500', glow: '', text: 'text-zinc-400' };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl border-b border-white/5 py-3.5 px-6 md:px-8" style={{ background: 'rgba(6, 10, 20, 0.7)' }}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar navigation"
          className="md:hidden -ml-2 text-zinc-400 hover:text-white cursor-pointer"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </Button>
        <div className="flex items-center gap-3 ml-auto">
          
          {/* Network Badge */}
          <div className="hidden sm:flex items-center">
            <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-300 gap-2 px-3 py-1.5 cursor-default">
              <div className="relative">
                <div className={clsx("w-2 h-2 rounded-full", networkColor.dot, networkColor.glow)}></div>
                <div className={clsx("absolute inset-0 w-2 h-2 rounded-full neon-dot", networkColor.dot)}></div>
              </div>
              <span className="text-xs font-medium">{network}</span>
            </Badge>
          </div>

          {/* Docs */}
          <Button variant="ghost" size="icon" asChild className="text-zinc-500 hover:text-stellar-400 hover:bg-white/5 transition-colors rounded-full cursor-pointer" aria-label="View documentation">
            <a href="https://github.com/efekrbas/anchorflow" target="_blank" rel="noopener noreferrer" title="Documentation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </a>
          </Button>

          {/* Notifications */}
          <DropdownMenu onOpenChange={handleNotificationOpenChange}>
            <DropdownMenuTrigger aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center text-zinc-500 hover:text-stellar-400 hover:bg-white/5 transition-colors rounded-full outline-none cursor-pointer">
              <Bell className="w-5 h-5" aria-hidden="true" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-stellar-500 rounded-full shadow-[0_0_10px_rgba(51,129,255,0.8)]">
                  <span className="absolute inset-0 w-2 h-2 rounded-full bg-stellar-500 neon-dot"></span>
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 glass-card-premium border-0 p-1 text-white shadow-[0_8px_48px_rgba(0,0,0,0.5)]">
              <div className="px-3 py-2.5 text-sm font-semibold flex items-center justify-between">
                Notifications
                {hasUnread && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stellar-500/20 text-stellar-400 font-medium">New</span>}
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-white/5 focus:text-white">
                <p className="text-sm font-medium">Welcome to AnchorFlow!</p>
                <p className="text-xs text-zinc-500">Connect your wallet to get started.</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-white/5 focus:text-white">
                <p className="text-sm font-medium">System Update</p>
                <p className="text-xs text-zinc-500">Testnet is running smoothly.</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wallet */}
          {address ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={handleCopy}
                className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white hover:border-stellar-500/30 flex items-center gap-2 h-9 px-4 transition-all cursor-pointer"
                title="Copy Address"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 neon-dot"></div>
                  </div>
                )}
                <span className={clsx("text-sm font-medium transition-colors", isCopied ? "text-emerald-400" : "text-zinc-200")}>
                  {isCopied ? "Copied" : formatAddress(address)}
                </span>
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                onClick={onDisconnect}
                aria-label="Disconnect wallet"
                className="rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-500/15 cursor-pointer transition-colors"
                title="Disconnect"
              >
                <LogOut className="w-4.5 h-4.5" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={onConnect}
              disabled={isConnecting}
              className="bg-gradient-to-r from-stellar-600 to-stellar-500 hover:from-stellar-500 hover:to-stellar-400 text-white rounded-full h-9 px-5 gap-2 shadow-[0_0_20px_rgba(51,129,255,0.2)] hover:shadow-[0_0_30px_rgba(51,129,255,0.4)] transition-all border-0 btn-premium cursor-pointer font-semibold"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
