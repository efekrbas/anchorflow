import React from 'react';
import { LayoutDashboard, Send, History, Settings, Zap } from 'lucide-react';
import clsx from 'clsx';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, logoSrc }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Transfer', icon: Send, id: 'transfer' },
    { name: 'History', icon: History, id: 'history' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col flex-1 w-full h-full bg-zinc-950/50 md:bg-transparent">
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(51,129,255,0.3)] bg-transparent relative">
            {logoSrc ? (
              <img src={logoSrc} alt="AnchorFlow Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-stellar-600 to-stellar-400 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">AnchorFlow</span>
            <span className="block text-[10px] font-medium text-zinc-600 tracking-widest uppercase">Smart Remittance</span>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 animate-stagger">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
              className={clsx(
                "w-full justify-start gap-3 h-11 px-3 font-medium transition-all duration-200 group cursor-pointer relative",
                isActive
                  ? "bg-stellar-500/10 text-stellar-400 hover:bg-stellar-500/15 hover:text-stellar-300"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={clsx("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-stellar-400" : "text-zinc-500 group-hover:text-zinc-100")} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-stellar-400 to-stellar-600 shadow-[0_0_12px_rgba(51,129,255,0.6)] animate-glow-pulse"></div>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Bottom Branding */}
      <div className="px-4 pb-5">
        <div className="mx-1 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-4"></div>
        <div className="glass-card rounded-xl p-3 flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stellar-500/20 to-purple-500/15 flex items-center justify-center border border-white/10 group-hover:border-stellar-500/30 transition-colors">
            <Zap className="w-4 h-4 text-stellar-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-300">Powered by Soroban</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">Stellar Smart Contracts</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-white/5 bg-surface-900/50 backdrop-blur-xl flex-col h-screen sticky top-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar via Sheet */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="left" className="p-0 w-72 bg-zinc-950 border-r border-white/10 text-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
