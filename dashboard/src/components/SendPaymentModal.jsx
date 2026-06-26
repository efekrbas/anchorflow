import React, { useState } from 'react';
import { Send, AlertCircle, Loader2 } from 'lucide-react';
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <DialogHeader className="mb-2">
          <div className="w-12 h-12 rounded-full bg-stellar-500/20 flex items-center justify-center mb-4 border border-stellar-500/30">
            <Send className="w-6 h-6 text-stellar-400" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">Send Payment</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Transfer XLM via Soroban Smart Contract
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-zinc-300">Destination Address</Label>
            <Input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="G..."
              className={clsx(
                "bg-black/40 border-white/10 focus-visible:ring-stellar-500/50 font-mono text-sm",
                isDestinationInvalid && "border-red-500/50 focus-visible:ring-red-500/50"
              )}
              required
            />
            {isDestinationInvalid && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">Must be a valid 56-character Stellar public key starting with G.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-zinc-300">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.0000001"
                step="any"
                className="bg-black/40 border-white/10 focus-visible:ring-stellar-500/50 pr-12"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-sm">
                XLM
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
            <Button
              type="submit"
              disabled={isSending || !destination || !amount || isDestinationInvalid}
              className={clsx(
                "w-full h-12 rounded-xl font-semibold text-white transition-all shadow-lg text-md",
                isSending || !destination || !amount || isDestinationInvalid
                  ? "bg-stellar-600/50"
                  : "bg-stellar-600 hover:bg-stellar-500 hover:shadow-[0_0_20px_rgba(51,129,255,0.4)] hover:-translate-y-0.5"
              )}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Transfer
                  <Send className="w-4 h-4 ml-2" />
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
