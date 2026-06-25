import React from 'react';
import { LayoutDashboard, Send, History, Settings, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ activeTab, setActiveTab, logoSrc }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Transfer', icon: Send, id: 'transfer' },
    { name: 'History', icon: History, id: 'history' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-surface-900/50 backdrop-blur-xl hidden md:flex flex-col relative z-10 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(51,129,255,0.4)] overflow-hidden">
            {logoSrc ? (
              <img src={logoSrc} alt="Brand Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-stellar-600 to-stellar-400 flex items-center justify-center">
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
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-left",
                isActive
                  ? "bg-stellar-500/10 text-stellar-400"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
              )}
            >
              <Icon className={clsx("w-5 h-5 flex-shrink-0", isActive ? "text-stellar-400" : "text-zinc-400 group-hover:text-zinc-100 transition-colors")} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1 h-4 rounded-full bg-stellar-500 animate-pulse-slow"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all"
        >
          <ExternalLink className="w-5 h-5" />
          Documentation
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
