import React, { useState, useEffect } from 'react';
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

  return (
    <header className="sticky top-0 z-40 bg-surface-900/50 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden -ml-2 text-zinc-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-4 ml-auto">
          
          <div className="hidden sm:flex items-center">
            <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-300 gap-1.5 px-3 py-1">
              <div className={clsx(
                "w-2 h-2 rounded-full", 
                network === 'Mainnet' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : 
                network === 'Testnet' ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : 
                "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"
              )}></div>
              {network}
            </Badge>
          </div>

          <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-stellar-400 hover:bg-white/5 transition-colors rounded-full">
            <a href="https://github.com/efekrbas/anchorflow" target="_blank" rel="noopener noreferrer" title="Documentation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </a>
          </Button>

          <DropdownMenu onOpenChange={handleNotificationOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-stellar-400 hover:bg-white/5 transition-colors rounded-full">
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-stellar-500 rounded-full shadow-[0_0_8px_rgba(51,129,255,0.8)]"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-zinc-950 border-white/10 text-white">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
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

          {address ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={handleCopy}
                className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white flex items-center gap-2 h-10 px-4"
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
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                onClick={onDisconnect}
                className="rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/20"
                title="Disconnect"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={onConnect}
              disabled={isConnecting}
              className="bg-stellar-600 hover:bg-stellar-500 text-white rounded-full h-10 px-5 gap-2 hover:shadow-[0_0_20px_rgba(51,129,255,0.4)] transition-all border-0"
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
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
