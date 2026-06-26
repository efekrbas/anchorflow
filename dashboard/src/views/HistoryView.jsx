import React from 'react';
import TransactionTable from '../components/TransactionTable';

const HistoryView = ({ transactions, address, onOpenSendModal }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight">Transaction History</h2>
        <p className="text-zinc-400 mt-1">View all your past activities and transfers.</p>
      </div>
      <TransactionTable transactions={transactions} address={address} onNavigateToTransfer={onOpenSendModal} />
    </div>
  );
};

export default HistoryView;
