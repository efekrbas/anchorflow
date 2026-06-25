import React from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Wallet, ArrowRightLeft } from 'lucide-react';
import clsx from 'clsx';

const TransactionTable = ({ transactions, address }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'success': return 'badge-success';
      case 'pending': return 'badge-pending';
      case 'failed': return 'badge-failed';
      default: return 'bg-white/10 text-white border border-white/20';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden mt-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
        <button className="text-sm font-medium text-stellar-400 hover:text-stellar-300 transition-colors">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="w-full text-left border-collapse hidden md:table">
          <thead>
            <tr className="bg-white/5 text-xs uppercase tracking-wider text-zinc-400 border-b border-white/10">
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">To / From</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {!address ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <Wallet className="w-12 h-12 mb-3 text-zinc-600/50" />
                    <p className="text-zinc-400 font-medium text-base">Please connect your wallet</p>
                    <p className="text-sm mt-1">You need to connect Freighter to view your transactions.</p>
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <ArrowRightLeft className="w-10 h-10 text-zinc-600" />
                    </div>
                    <p className="text-zinc-300 font-semibold text-lg">No transactions yet</p>
                    <p className="text-zinc-500 mt-1 max-w-sm mx-auto">When you send or receive payments, they will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isSend = tx.from === address;
                return (
                  <tr key={tx.id} className="tx-row group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          isSend ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                        )}>
                          {isSend ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <span className="font-medium text-zinc-200">{isSend ? 'Send' : 'Receive'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-400 font-mono text-xs">
                      {isSend ? (tx.to?.slice(0, 8) || 'Unknown') + '...' : (tx.from?.slice(0, 8) || 'Unknown') + '...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx("font-semibold", isSend ? "text-white" : "text-emerald-400")}>
                        {isSend ? '-' : '+'}{formatAmount(tx.amount)} XLM
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                      {formatDate(tx.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium inline-block", getBadgeClass(tx.status))}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 inline-flex rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Mobile List View */}
        <div className="md:hidden flex flex-col divide-y divide-white/5">
          {!address ? (
            <div className="px-6 py-16 text-center">
              <div className="flex flex-col items-center justify-center text-zinc-500">
                <Wallet className="w-12 h-12 mb-3 text-zinc-600/50" />
                <p className="text-zinc-400 font-medium text-base">Please connect your wallet</p>
                <p className="text-sm mt-1">You need to connect Freighter to view your transactions.</p>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <ArrowRightLeft className="w-10 h-10 text-zinc-600" />
                </div>
                <p className="text-zinc-300 font-semibold text-lg">No transactions yet</p>
                <p className="text-zinc-500 mt-1 max-w-sm mx-auto">When you send or receive payments, they will appear here.</p>
              </div>
            </div>
          ) : (
            transactions.map((tx) => {
              const isSend = tx.from === address;
              return (
                <div key={tx.id} className="p-4 flex flex-col gap-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isSend ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                      )}>
                        {isSend ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-200">{isSend ? 'Sent XLM' : 'Received XLM'}</p>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">
                          {isSend ? 'To: ' + (tx.to?.slice(0, 8) || 'Unknown') + '...' : 'From: ' + (tx.from?.slice(0, 8) || 'Unknown') + '...'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={clsx("font-bold block", isSend ? "text-white" : "text-emerald-400")}>
                        {isSend ? '-' : '+'}{formatAmount(tx.amount)} XLM
                      </span>
                      <span className="text-xs text-zinc-500 block mt-0.5">
                        {formatDate(tx.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={clsx("px-2 py-0.5 rounded-md text-[10px] font-medium inline-block", getBadgeClass(tx.status))}>
                      {tx.status.toUpperCase()}
                    </span>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-stellar-400 flex items-center gap-1 hover:text-stellar-300"
                    >
                      View explorer <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
