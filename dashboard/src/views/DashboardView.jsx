import React from 'react';
import clsx from 'clsx';
import { Send, Wallet, Activity, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TransactionTable from '../components/TransactionTable';
import DashboardChart from '../components/DashboardChart';
import { Button } from "@/components/ui/button";
import { CURRENCY_SYMBOLS } from '../utils/constants';

const DashboardView = ({ 
  address, 
  metrics, 
  transactions, 
  xlmPrice, 
  network, 
  fiatCurrency, 
  onOpenSendModal,
  onViewAll,
  onNavigateToTransfer
}) => {
  const currentSymbol = CURRENCY_SYMBOLS[fiatCurrency] || '$';
  
  const calculateFiatValue = () => {
    if (!address || !xlmPrice) return '';
    const numericBalance = parseFloat(metrics.balance.replace(/,/g, ''));
    if (isNaN(numericBalance)) return '';
    return `~ ${currentSymbol}${(numericBalance * xlmPrice).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${fiatCurrency.toUpperCase()}`;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-zinc-400 mt-1">Manage your AnchorFlow smart contract remittances.</p>
        </div>
        <Button 
          onClick={onNavigateToTransfer}
          disabled={!address}
          size="lg"
          className={clsx(
            "gap-2 rounded-xl text-base font-semibold shadow-[0_0_20px_rgba(51,129,255,0.2)] hover:shadow-[0_0_20px_rgba(51,129,255,0.4)] bg-stellar-600 hover:bg-stellar-500 hover:-translate-y-0.5 transition-all text-white",
            !address && "opacity-50"
          )}
        >
          <Send className="w-5 h-5" />
          Send Payment
        </Button>
      </div>

      <DashboardChart address={address} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Total Balance" 
          value={address ? `${metrics.balance} XLM` : 'Connect wallet'} 
          subtext={calculateFiatValue()}
          icon={Wallet}
          delayClass="animate-slide-up"
          style={{ animationDelay: '100ms' }}
        />
        <MetricCard 
          title="Transactions" 
          value={address ? metrics.totalTx : 'Connect wallet'} 
          icon={ArrowRightLeft}
          trend={address ? "+2 this week" : null}
          delayClass="animate-slide-up"
          style={{ animationDelay: '200ms' }}
        />
        <MetricCard 
          title="Network Status" 
          value={network} 
          icon={Activity}
          delayClass="animate-slide-up"
          style={{ animationDelay: '300ms' }}
        />
        <MetricCard 
          title="Contract Status" 
          value="Active" 
          icon={ShieldCheck}
          delayClass="animate-slide-up"
          style={{ animationDelay: '400ms' }}
        />
      </div>

      <TransactionTable transactions={transactions} address={address} limit={3} onNavigateToTransfer={onOpenSendModal} onViewAll={onViewAll} />
    </>
  );
};

export default DashboardView;
