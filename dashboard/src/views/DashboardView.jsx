import React from 'react';
import clsx from 'clsx';
import { Send, Wallet, Activity, ArrowRightLeft, ShieldCheck, ArrowUpRight } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TransactionTable from '../components/TransactionTable';
import DashboardChart from '../components/DashboardChart';
import { Button } from "@/components/ui/button";
import { CURRENCY_SYMBOLS } from '../utils/constants';
import { useScrollReveal } from '../hooks/useScrollReveal';

const DashboardView = ({ 
  address, 
  metrics, 
  transactions, 
  xlmPrice, 
  network, 
  fiatCurrency, 
  onOpenSendModal,
  onViewAll
}) => {
  const currentSymbol = CURRENCY_SYMBOLS[fiatCurrency] || '$';
  
  // Scroll-reveal refs (high-end-visual-design §5C + fixing-motion-performance §4)
  const [headerRef, headerVisible] = useScrollReveal();
  const [chartRef, chartVisible] = useScrollReveal({ rootMargin: '0px 0px -40px 0px' });
  const [metricsRef, metricsVisible] = useScrollReveal({ rootMargin: '0px 0px -40px 0px' });
  const [tableRef, tableVisible] = useScrollReveal({ rootMargin: '0px 0px -40px 0px' });

  const calculateFiatValue = () => {
    if (!address || !xlmPrice) return '';
    const numericBalance = parseFloat(metrics.balance.replace(/,/g, ''));
    if (isNaN(numericBalance)) return '';
    return `~ ${currentSymbol}${(numericBalance * xlmPrice).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${fiatCurrency.toUpperCase()}`;
  };

  return (
    <>
      {/* Page Header — with eyebrow tag (high-end-visual-design §4C) */}
      <div 
        ref={headerRef} 
        className={clsx("scroll-reveal", headerVisible && "is-visible")}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="eyebrow-tag mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-stellar-400 inline-block" aria-hidden="true"></span>
              Live Dashboard
            </span>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-gradient-stellar">Dashboard</span>
            </h1>
            <p className="text-zinc-400 mt-1.5">Manage your AnchorFlow smart contract remittances.</p>
          </div>
          <Button 
            onClick={onOpenSendModal}
            disabled={!address}
            size="lg"
            className={clsx(
              "gap-2 rounded-xl text-sm font-semibold btn-premium cursor-pointer group",
              "bg-gradient-to-r from-stellar-600 to-stellar-500 hover:from-stellar-500 hover:to-stellar-400",
              "shadow-[0_0_20px_rgba(51,129,255,0.15)] hover:shadow-[0_0_30px_rgba(51,129,255,0.35)]",
              "hover:-translate-y-0.5 transition-all text-white border-0",
              !address && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="w-4.5 h-4.5" aria-hidden="true" />
            Send Payment
            <span className="btn-trailing-icon" aria-hidden="true">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Button>
        </div>
      </div>

      {/* Chart — Double-Bezel wrapper (high-end-visual-design §4A) */}
      <div 
        ref={chartRef} 
        className={clsx("scroll-reveal card-double-bezel mb-8", chartVisible && "is-visible")}
      >
        <div className="card-double-bezel-inner overflow-hidden">
          <DashboardChart address={address} />
        </div>
      </div>

      {/* Metric Cards — scroll-triggered stagger reveal */}
      <div 
        ref={metricsRef}
        className={clsx(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 stagger-reveal",
          metricsVisible && "is-visible"
        )}
        role="region"
        aria-label="Account metrics"
      >
        <MetricCard 
          title="Total Balance" 
          value={address ? `${metrics.balance} XLM` : 'Connect wallet'} 
          subtext={calculateFiatValue()}
          icon={Wallet}
        />
        <MetricCard 
          title="Transactions" 
          value={address ? metrics.totalTx : 'Connect wallet'} 
          icon={ArrowRightLeft}
          trend={address ? "+2 this week" : null}
        />
        <MetricCard 
          title="Network Status" 
          value={network} 
          icon={Activity}
        />
        <MetricCard 
          title="Contract Status" 
          value="Active" 
          icon={ShieldCheck}
        />
      </div>

      {/* Transaction Table — scroll reveal */}
      <div 
        ref={tableRef}
        className={clsx("scroll-reveal", tableVisible && "is-visible")}
      >
        <TransactionTable 
          transactions={transactions} 
          address={address} 
          limit={3} 
          onNavigateToTransfer={onOpenSendModal} 
          onViewAll={onViewAll} 
        />
      </div>
    </>
  );
};

export default DashboardView;
