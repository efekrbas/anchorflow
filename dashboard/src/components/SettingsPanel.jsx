import React, { useState } from 'react';
import { ShieldCheck, Globe, Zap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingsPanel = ({ network, setNetwork, fiatCurrency, setFiatCurrency, address }) => {
  const [autoDisconnect, setAutoDisconnect] = useState(true);

  if (!address) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient-stellar">Settings</span>
          </h2>
          <p className="text-zinc-400 mt-1.5">Manage your application preferences and security.</p>
        </div>
        <div className="card-double-bezel">
          <div className="card-double-bezel-inner p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center mb-5 relative z-10">
              <ShieldCheck className="w-7 h-7 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2 relative z-10">Connect wallet</h2>
            <p className="text-zinc-500 max-w-sm relative z-10">Please connect your Freighter wallet to access and modify your settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient-stellar">Settings</span>
        </h2>
        <p className="text-zinc-400 mt-1.5">Manage your application preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Preferences Section */}
        <Card className="card-double-bezel border-0 text-white shadow-none bg-transparent flex flex-col">
          <div className="card-double-bezel-inner relative overflow-hidden pb-6 flex-1 flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stellar-500/15 to-purple-500/10 border border-white/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-stellar-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Preferences</CardTitle>
                <CardDescription className="text-zinc-500 text-sm">Network and currency settings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-zinc-300 text-sm font-medium">Network Selection</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger className="w-full bg-white/[0.03] border-white/10 rounded-xl px-4 py-6 text-white focus:ring-stellar-500/40 cursor-pointer">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 text-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                  <SelectItem value="Testnet" className="cursor-pointer">Stellar Testnet</SelectItem>
                  <SelectItem value="Mainnet" className="cursor-pointer">Stellar Mainnet</SelectItem>
                  <SelectItem value="Futurenet" className="cursor-pointer">Stellar Futurenet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-300 text-sm font-medium">Display Currency (Fiat)</Label>
              <Select value={fiatCurrency} onValueChange={setFiatCurrency}>
                <SelectTrigger className="w-full bg-white/[0.03] border-white/10 rounded-xl px-4 py-6 text-white focus:ring-stellar-500/40 cursor-pointer">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 text-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                  <SelectItem value="usd" className="cursor-pointer">USD - US Dollar ($)</SelectItem>
                  <SelectItem value="eur" className="cursor-pointer">EUR - Euro (€)</SelectItem>
                  <SelectItem value="try" className="cursor-pointer">TRY - Turkish Lira (₺)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          </div>
        </Card>

        {/* Security Section */}
        <Card className="card-double-bezel border-0 text-white shadow-none bg-transparent flex flex-col">
          <div className="card-double-bezel-inner relative overflow-hidden pb-6 flex-1 flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Security</CardTitle>
                <CardDescription className="text-zinc-500 text-sm">Security preferences and limits.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-200 text-sm font-medium">Auto-Disconnect</Label>
                <p className="text-xs text-zinc-500 mt-0.5">Disconnect wallet after 15m of inactivity.</p>
              </div>
              <Switch 
                checked={autoDisconnect}
                onCheckedChange={setAutoDisconnect}
                className="cursor-pointer"
              />
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"></div>

            <div className="flex items-center justify-between opacity-40 pointer-events-none">
              <div>
                <Label className="text-zinc-200 text-sm font-medium">Require Password</Label>
                <p className="text-xs text-zinc-500 mt-0.5">Prompt password on every transaction.</p>
              </div>
              <Switch checked={false} disabled />
            </div>

            <div className="flex items-center justify-between opacity-40 pointer-events-none">
              <div>
                <Label className="text-zinc-200 text-sm font-medium">Two-Factor Auth</Label>
                <p className="text-xs text-zinc-500 mt-0.5">Enable 2FA for additional security.</p>
              </div>
              <Switch checked={false} disabled />
            </div>
          </CardContent>
          </div>
        </Card>
      </div>

      {/* Contract Info */}
      <Card className="card-double-bezel border-0 text-white shadow-none bg-transparent flex flex-col mt-6">
        <div className="card-double-bezel-inner relative overflow-hidden flex-1">
        <CardContent className="p-5 flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stellar-500/10 to-purple-500/8 border border-white/8 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-stellar-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-300">Smart Contract</p>
            <p className="text-xs text-zinc-600 mt-0.5 font-mono truncate">Powered by Soroban on Stellar Network</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
        </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;
