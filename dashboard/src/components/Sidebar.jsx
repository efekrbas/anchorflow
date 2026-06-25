import React from 'react';
import { LayoutDashboard, Send, History, Settings, ExternalLink, X } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Transfer', icon: Send, id: 'transfer' },
    { name: 'History', icon: History, id: 'history' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      <aside className={clsx(
        "w-64 border-r border-white/5 bg-surface-900/50 backdrop-blur-xl flex flex-col h-screen fixed md:sticky top-0 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(51,129,255,0.4)] overflow-hidden bg-white/5">
              <img src="/logo.jpg" alt="AnchorFlow Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AnchorFlow</span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
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
                <div className="ml-auto w-1.5 h-4 rounded-full bg-stellar-500 shadow-[0_0_8px_rgba(51,129,255,0.6)]"></div>
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
    </>
  );
};

export default Sidebar;
