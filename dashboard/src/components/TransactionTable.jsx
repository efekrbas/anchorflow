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
      case 'success': case 'completed': return 'badge-success';
      case 'pending': case 'processing': return 'badge-pending';
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

  const EmptyState = ({ icon: Icon, title, subtitle, showAction }) => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-zinc-600" />
      </div>
      <p className="text-zinc-300 font-semibold text-lg">{title}</p>
      <p className="text-zinc-500 mt-1.5 mb-5 max-w-sm mx-auto text-sm text-center">{subtitle}</p>
      {showAction && onNavigateToTransfer && (
        <Button 
          onClick={onNavigateToTransfer} 
          className="bg-gradient-to-r from-stellar-600 to-stellar-500 hover:from-stellar-500 hover:to-stellar-400 text-white rounded-xl px-6 shadow-[0_0_20px_rgba(51,129,255,0.15)] hover:shadow-[0_0_25px_rgba(51,129,255,0.3)] transition-all cursor-pointer btn-premium"
        >
          Make your first transfer
        </Button>
      )}
    </div>
  );

  return (
    <div className="card-double-bezel mt-8">
      <div className="card-double-bezel-inner overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stellar-500/10 to-purple-500/8 border border-white/8 flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4 text-stellar-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
        </div>
        {hasMore && onViewAll && (
          <Button variant="link" onClick={onViewAll} className="text-stellar-400 hover:text-stellar-300 cursor-pointer text-sm">
            View All
          </Button>
        )}
      </div>

      <div className="w-full">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-white/[0.02] border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-zinc-500 font-medium text-xs uppercase tracking-wider">To / From</TableHead>
                <TableHead className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Amount</TableHead>
                <TableHead className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-zinc-500 font-medium text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-zinc-500 font-medium text-xs uppercase tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/[0.04] text-sm">
              {!address ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <EmptyState icon={Wallet} title="Please connect your wallet" subtitle="You need to connect Freighter to view your transactions." />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <EmptyState icon={ArrowRightLeft} title="No transactions yet" subtitle="When you send or receive payments, they will appear here." showAction />
                  </TableCell>
                </TableRow>
              ) : (
                displayTransactions.map((tx, idx) => {
                  const isSend = tx.from === address;
                  return (
                    <TableRow 
                      key={tx.id} 
                      className="hover:bg-white/[0.03] border-white/[0.04] transition-colors row-glow cursor-default"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            "w-8 h-8 rounded-lg flex items-center justify-center border",
                            isSend 
                              ? "bg-red-500/8 text-red-400 border-red-500/15" 
                              : "bg-emerald-500/8 text-emerald-400 border-emerald-500/15"
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
                      <TableCell className="text-zinc-500 text-xs">
                        {formatDate(tx.created_at)}
                      </TableCell>
                      <TableCell>
                        <span className={clsx("px-2.5 py-1 rounded-full text-[11px] font-medium inline-block", getBadgeClass(tx.status))}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild className="text-zinc-500 hover:text-stellar-400 rounded-lg cursor-pointer hover:bg-white/5 transition-colors" aria-label="View transaction on block explorer">
                          <a href={`https://stellar.expert/explorer/testnet/tx/${tx.id}`} target="_blank" rel="noopener noreferrer" title="View transaction">
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
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
        <div className="md:hidden flex flex-col divide-y divide-white/[0.04]">
          {!address ? (
            <EmptyState icon={Wallet} title="Please connect your wallet" subtitle="You need to connect Freighter to view your transactions." />
          ) : transactions.length === 0 ? (
            <EmptyState icon={ArrowRightLeft} title="No transactions yet" subtitle="When you send or receive payments, they will appear here." showAction />
          ) : (
            displayTransactions.map((tx) => {
              const isSend = tx.from === address;
              return (
                <div key={tx.id} className="p-4 flex flex-col gap-3 hover:bg-white/[0.03] transition-colors row-glow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center border",
                        isSend 
                          ? "bg-red-500/8 text-red-400 border-red-500/15" 
                          : "bg-emerald-500/8 text-emerald-400 border-emerald-500/15"
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
                      className="text-xs text-stellar-400 flex items-center gap-1 hover:text-stellar-300 cursor-pointer transition-colors"
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
    </div>
  );
};

export default TransactionTable;
