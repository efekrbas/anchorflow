import React, { useState, useEffect, useRef } from 'react';
import { Search, LayoutDashboard, Send, History, Settings } from 'lucide-react';
import clsx from 'clsx';

const CommandPalette = ({ isOpen, onClose, onNavigate, onSendPayment }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const actions = [
    { id: 'dashboard', name: 'Go to Dashboard', icon: LayoutDashboard, handler: () => onNavigate('dashboard') },
    { id: 'transfer', name: 'Go to Transfer', icon: Send, handler: () => onNavigate('transfer') },
    { id: 'history', name: 'Go to History', icon: History, handler: () => onNavigate('history') },
    { id: 'settings', name: 'Go to Settings', icon: Settings, handler: () => onNavigate('settings') },
    { id: 'send_payment', name: 'Send Payment', icon: Send, handler: onSendPayment },
  ];

  const filteredActions = actions.filter(action => 
    action.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredActions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredActions.length > 0) {
        e.preventDefault();
        filteredActions[selectedIndex].handler();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 sm:px-0">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-xl bg-zinc-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 text-lg"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400 font-medium border border-white/5">ESC</span>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="px-4 py-8 text-center text-zinc-500">
              No results found for "{query}"
            </div>
          ) : (
            filteredActions.map((action, index) => {
              const Icon = action.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    action.handler();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors",
                    isSelected ? "bg-stellar-600/20 text-white" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <Icon className={clsx("w-5 h-5", isSelected ? "text-stellar-400" : "text-zinc-500")} />
                  <span className="font-medium">{action.name}</span>
                  {isSelected && (
                    <span className="ml-auto text-xs text-stellar-400/70">Press Enter</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
