import React from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Wallet, ArrowRightLeft } from 'lucide-react';
import clsx from 'clsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const TransactionTable = ({ transactions, address, onNavigateToTransfer, limit, onViewAll }) => {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  const hasMore = limit && transactions.length > limit;
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
    <div className="glass-card rounded-2xl overflow-hidden mt-8 animate-slide-up bg-zinc-950/50" style={{ animationDelay: '300ms' }}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
        {hasMore && onViewAll && (
          <Button variant="link" onClick={onViewAll} className="text-stellar-400 hover:text-stellar-300">
            View All
          </Button>
        )}
      </div>

      <div className="w-full">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-white/5 border-b border-white/10">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-zinc-400 font-medium">Type</TableHead>
                <TableHead className="text-zinc-400 font-medium">To / From</TableHead>
                <TableHead className="text-zinc-400 font-medium">Amount</TableHead>
                <TableHead className="text-zinc-400 font-medium">Date</TableHead>
                <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                <TableHead className="text-zinc-400 font-medium text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5 text-sm">
              {!address ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <Wallet className="w-12 h-12 mb-3 text-zinc-600/50" />
                      <p className="text-zinc-400 font-medium text-base">Please connect your wallet</p>
                      <p className="text-sm mt-1">You need to connect Freighter to view your transactions.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <ArrowRightLeft className="w-8 h-8 text-zinc-600" />
                      </div>
                      <p className="text-zinc-300 font-semibold text-lg">No transactions yet</p>
                      <p className="text-zinc-500 mt-1 mb-4 max-w-sm mx-auto">When you send or receive payments, they will appear here.</p>
                      {onNavigateToTransfer && (
                        <Button onClick={onNavigateToTransfer} className="bg-stellar-600 hover:bg-stellar-500 text-white rounded-xl px-6">
                          Make your first transfer
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displayTransactions.map((tx) => {
                  const isSend = tx.from === address;
                  return (
                    <TableRow key={tx.id} className="hover:bg-white/5 border-white/5 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            isSend ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                          )}>
                            {isSend ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <span className="font-medium text-zinc-200">{isSend ? 'Send' : 'Receive'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-400 font-mono text-xs">
                        {isSend ? (tx.to?.slice(0, 8) || 'Unknown') + '...' : (tx.from?.slice(0, 8) || 'Unknown') + '...'}
                      </TableCell>
                      <TableCell>
                        <span className={clsx("font-semibold", isSend ? "text-white" : "text-emerald-400")}>
                          {isSend ? '-' : '+'}{formatAmount(tx.amount)} XLM
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {formatDate(tx.created_at)}
                      </TableCell>
                      <TableCell>
                        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium inline-block", getBadgeClass(tx.status))}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white rounded-lg">
                          <a href={`https://stellar.expert/explorer/testnet/tx/${tx.id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

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
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <ArrowRightLeft className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-zinc-300 font-semibold text-lg">No transactions yet</p>
                <p className="text-zinc-500 mt-1 mb-4 max-w-sm mx-auto">When you send or receive payments, they will appear here.</p>
                {onNavigateToTransfer && (
                  <Button onClick={onNavigateToTransfer} className="bg-stellar-600 hover:bg-stellar-500 text-white rounded-xl w-full">
                    Make your first transfer
                  </Button>
                )}
              </div>
            </div>
          ) : (
            displayTransactions.map((tx) => {
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
