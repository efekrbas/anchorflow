import React from 'react';
import clsx from 'clsx';
import { Send, Wallet, Activity, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TransactionTable from '../components/TransactionTable';
import { CURRENCY_SYMBOLS } from '../utils/constants';

const DashboardView = ({ 
  address, 
  metrics, 
  transactions, 
  xlmPrice, 
  network, 
  fiatCurrency, 
  onOpenSendModal 
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-zinc-400 mt-1">Manage your AnchorFlow smart contract remittances.</p>
        </div>
        <button 
          onClick={onOpenSendModal}
          disabled={!address}
          className={clsx(
            "btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all",
            !address ? "opacity-50 cursor-not-allowed bg-zinc-800" : "bg-stellar-600 hover:bg-stellar-500 hover:shadow-[0_0_20px_rgba(51,129,255,0.4)] hover:-translate-y-0.5"
          )}
        >
          <Send className="w-4 h-4" />
          Send Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Balance" 
          value={address ? `${metrics.balance} XLM` : '---'} 
          subtext={calculateFiatValue()}
          icon={Wallet}
          delayClass="animate-slide-up"
          style={{ animationDelay: '100ms' }}
        />
        <MetricCard 
          title="Transactions" 
          value={address ? metrics.totalTx : '---'} 
          icon={ArrowRightLeft}
          trend="+2 this week"
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

      <TransactionTable transactions={transactions} address={address} limit={3} />
    </>
  );
};

export default DashboardView;
