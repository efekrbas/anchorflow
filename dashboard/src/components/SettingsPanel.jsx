import React, { useState } from 'react';
import { ShieldCheck, Globe, DollarSign, Power, Moon } from 'lucide-react';
import clsx from 'clsx';

const SettingsPanel = ({ network, setNetwork, fiatCurrency, setFiatCurrency }) => {
  const [autoDisconnect, setAutoDisconnect] = useState(true);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-zinc-400 mt-1">Manage your application preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Preferences Section */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-stellar-400" />
            <h3 className="text-xl font-semibold text-white">Preferences</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Network Selection</label>
              <div className="relative">
                <select 
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-stellar-500/50 transition-colors"
                >
                  <option value="Testnet">Stellar Testnet</option>
                  <option value="Mainnet">Stellar Mainnet</option>
                  <option value="Futurenet">Stellar Futurenet</option>
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none">
                  <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Display Currency (Fiat)</label>
              <div className="relative">
                <select 
                  value={fiatCurrency}
                  onChange={(e) => setFiatCurrency(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-stellar-500/50 transition-colors"
                >
                  <option value="usd">USD - US Dollar ($)</option>
                  <option value="eur">EUR - Euro (€)</option>
                  <option value="try">TRY - Turkish Lira (₺)</option>
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none">
                  <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">Security</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-200">Auto-Disconnect</p>
                <p className="text-sm text-zinc-500 mt-0.5">Disconnect wallet after 15m of inactivity.</p>
              </div>
              <button 
                onClick={() => setAutoDisconnect(!autoDisconnect)}
                className={clsx(
                  "relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0",
                  autoDisconnect ? "bg-stellar-500" : "bg-zinc-700"
                )}
              >
                <div className={clsx(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300",
                  autoDisconnect ? "transform translate-x-6" : ""
                )}></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between opacity-50 pointer-events-none">
              <div>
                <p className="font-medium text-zinc-200">Require Password</p>
                <p className="text-sm text-zinc-500 mt-0.5">Prompt password on every transaction.</p>
              </div>
              <button className="relative w-12 h-6 rounded-full bg-zinc-700 transition-colors duration-300 flex-shrink-0">
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-zinc-400"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
