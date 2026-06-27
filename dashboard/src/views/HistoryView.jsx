import React from 'react';
import clsx from 'clsx';
import TransactionTable from '../components/TransactionTable';
import { useScrollReveal } from '../hooks/useScrollReveal';

const HistoryView = ({ transactions, address, onOpenSendModal }) => {
  const [headerRef, headerVisible] = useScrollReveal();
  const [tableRef, tableVisible] = useScrollReveal({ rootMargin: '0px 0px -40px 0px' });

  return (
    <>
      <div 
        ref={headerRef}
        className={clsx("scroll-reveal mb-8", headerVisible && "is-visible")}
      >
        <span className="eyebrow-tag mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-stellar-400 inline-block" aria-hidden="true"></span>
          Archive
        </span>
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient-stellar">Transaction History</span>
        </h2>
        <p className="text-zinc-400 mt-1.5">View all your past activities and transfers.</p>
      </div>
      <div 
        ref={tableRef}
        className={clsx("scroll-reveal", tableVisible && "is-visible")}
      >
        <TransactionTable transactions={transactions} address={address} onNavigateToTransfer={onOpenSendModal} />
      </div>
    </>
  );
};

export default HistoryView;
