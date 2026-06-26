import React from 'react';
import { LayoutDashboard, Send, History, Settings } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-zinc-950/50 md:bg-transparent">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(51,129,255,0.4)] bg-transparent">
            {logoSrc ? (
              <img src={logoSrc} alt="Brand Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-lg bg-gradient-to-tr from-stellar-600 to-stellar-400 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            )}
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AnchorFlow</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => {
                setActiveTab(item.id);
                onClose(); // close on mobile when link is clicked
              }}
              className={clsx(
                "w-full justify-start gap-3 h-11 px-3 font-medium transition-all duration-200 group",
                isActive
                  ? "bg-stellar-500/10 text-stellar-400 hover:bg-stellar-500/20 hover:text-stellar-300"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
              )}
            >
              <Icon className={clsx("w-5 h-5 flex-shrink-0", isActive ? "text-stellar-400" : "text-zinc-400 group-hover:text-zinc-100")} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-4 rounded-full bg-stellar-500 shadow-[0_0_8px_rgba(51,129,255,0.6)]"></div>
              )}
            </Button>
          );
        })}
      </nav>

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
