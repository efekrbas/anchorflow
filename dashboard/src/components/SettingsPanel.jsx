import React, { useState } from 'react';
import { ShieldCheck, Globe } from 'lucide-react';
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
          <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
          <p className="text-zinc-400 mt-1">Manage your application preferences and security.</p>
        </div>
        <div className="glass-card rounded-2xl p-12 border border-white/10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Connect wallet</h2>
          <p className="text-zinc-500 max-w-sm">Please connect your Freighter wallet to access and modify your settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-zinc-400 mt-1">Manage your application preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Preferences Section */}
        <Card className="bg-zinc-950/50 border-white/10 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-stellar-400" />
              <CardTitle className="text-xl">Preferences</CardTitle>
            </div>
            <CardDescription className="text-zinc-400">Manage network and currency settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-zinc-300">Network Selection</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger className="w-full bg-black/40 border-white/10 rounded-xl px-4 py-6 text-white focus:ring-stellar-500/50">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                  <SelectItem value="Testnet">Stellar Testnet</SelectItem>
                  <SelectItem value="Mainnet">Stellar Mainnet</SelectItem>
                  <SelectItem value="Futurenet">Stellar Futurenet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-300">Display Currency (Fiat)</Label>
              <Select value={fiatCurrency} onValueChange={setFiatCurrency}>
                <SelectTrigger className="w-full bg-black/40 border-white/10 rounded-xl px-4 py-6 text-white focus:ring-stellar-500/50">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                  <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
                  <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                  <SelectItem value="try">TRY - Turkish Lira (₺)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="bg-zinc-950/50 border-white/10 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <CardTitle className="text-xl">Security</CardTitle>
            </div>
            <CardDescription className="text-zinc-400">Manage security preferences and limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-200 text-base">Auto-Disconnect</Label>
                <p className="text-sm text-zinc-500 mt-0.5">Disconnect wallet after 15m of inactivity.</p>
              </div>
              <Switch 
                checked={autoDisconnect}
                onCheckedChange={setAutoDisconnect}
              />
            </div>
            
            <div className="flex items-center justify-between opacity-50 pointer-events-none">
              <div>
                <Label className="text-zinc-200 text-base">Require Password</Label>
                <p className="text-sm text-zinc-500 mt-0.5">Prompt password on every transaction.</p>
              </div>
              <Switch checked={false} disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPanel;
