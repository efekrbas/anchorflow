import React, { useState } from 'react';
import { X, Send, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const SendPaymentModal = ({ isOpen, onClose, onSend, isSending }) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !amount) return;
    onSend({ destination, amount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      ></div>
      
      <div className="relative glass-card w-full max-w-md rounded-2xl p-6 sm:p-8 animate-slide-up border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-stellar-500/20 flex items-center justify-center mb-4 border border-stellar-500/30">
            <Send className="w-6 h-6 text-stellar-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Send Payment</h2>
          <p className="text-zinc-400 text-sm mt-1">Transfer XLM via Soroban Smart Contract</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Destination Address</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="G..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-stellar-500/50 focus:border-stellar-500/50 transition-all font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Amount (XLM)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.0000001"
                step="any"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-stellar-500/50 focus:border-stellar-500/50 transition-all pl-12"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">
                $
              </span>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 mt-2">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-200/80 leading-relaxed">
              This transaction will be executed via the AnchorFlow Soroban contract. Ensure the destination address is correct.
            </p>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSending || !destination || !amount}
              className={clsx(
                "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all shadow-lg",
                isSending || !destination || !amount
                  ? "bg-stellar-600/50 cursor-not-allowed"
                  : "bg-stellar-600 hover:bg-stellar-500 hover:shadow-[0_0_20px_rgba(51,129,255,0.4)] hover:-translate-y-0.5 btn-primary"
              )}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Transfer
                  <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendPaymentModal;
