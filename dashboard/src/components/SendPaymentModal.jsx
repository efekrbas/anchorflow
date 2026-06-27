import React, { useState } from 'react';
import { Send, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SendPaymentModal = ({ isOpen, onClose, onSend, isSending }) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !amount) return;
    onSend({ destination, amount });
  };

  const isDestinationInvalid = destination && !/^G[A-Z0-9]{55}$/.test(destination);
  const isValid = destination && amount && !isDestinationInvalid;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-zinc-950/95 backdrop-blur-2xl border-white/10 text-white shadow-[0_0_60px_rgba(0,0,0,0.5),0_0_30px_rgba(51,129,255,0.05)]">
        <DialogHeader className="mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stellar-500/20 to-purple-500/15 flex items-center justify-center mb-4 border border-stellar-500/25 shadow-[0_0_25px_rgba(51,129,255,0.15)]">
            <Send className="w-6 h-6 text-stellar-400" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">Send Payment</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Transfer XLM via Soroban Smart Contract
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-zinc-300 text-sm font-medium">Destination Address</Label>
            <div className="relative">
              <Input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="G..."
                aria-describedby={isDestinationInvalid ? 'destination-error' : undefined}
                aria-invalid={isDestinationInvalid || undefined}
                className={clsx(
                  "bg-white/[0.03] border-white/10 focus-visible:ring-stellar-500/40 focus-visible:border-stellar-500/30 font-mono text-sm transition-all",
                  isDestinationInvalid && "border-red-500/40 focus-visible:ring-red-500/40"
                )}
                required
              />
              {destination && !isDestinationInvalid && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/70" aria-hidden="true" />
              )}
            </div>
            {isDestinationInvalid && (
              <p id="destination-error" role="alert" className="text-red-400 text-xs mt-1.5 ml-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                Must be a valid 56-character Stellar public key starting with G.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-zinc-300 text-sm font-medium">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.0000001"
                step="any"
                className="bg-white/[0.03] border-white/10 focus-visible:ring-stellar-500/40 focus-visible:border-stellar-500/30 pr-14 transition-all"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold text-xs tracking-wider">
                XLM
              </span>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 flex gap-3 mt-2" role="note">
            <AlertCircle className="w-5 h-5 text-stellar-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              This transaction will be executed via the AnchorFlow Soroban contract. Ensure the destination address is correct.
            </p>
          </div>

          <div className="mt-6 pt-1">
            <Button 
              type="submit" 
              className="w-full gap-3 rounded-full py-7 text-sm font-semibold bg-gradient-to-r from-stellar-600 to-stellar-500 hover:from-stellar-500 hover:to-stellar-400 shadow-[0_0_20px_rgba(51,129,255,0.15)] hover:shadow-[0_8px_40px_rgba(51,129,255,0.35)] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white cursor-pointer border-0 group relative z-10"
              disabled={isSending || !isValid}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Transfer
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105" aria-hidden="true">
                    <Send className="w-4 h-4 ml-1" />
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendPaymentModal;
