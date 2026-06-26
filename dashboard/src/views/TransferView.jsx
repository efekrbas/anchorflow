import React from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";

const TransferView = ({ onOpenSendModal, address }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight">Transfer</h2>
        <p className="text-zinc-400 mt-1">Send XLM payments securely via Soroban smart contract.</p>
      </div>

      {!address ? (
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-12 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Connect wallet</h3>
            <p className="text-zinc-500 max-w-sm">You must connect your Freighter wallet to send direct transfers and manage funds.</p>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-stellar-500/20 flex items-center justify-center border border-stellar-500/30">
                <Send className="w-7 h-7 text-stellar-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Direct Transfer</h3>
                <p className="text-zinc-400 text-sm mt-1">Send funds securely to any Stellar address.</p>
              </div>
            </div>
            <Button 
              onClick={onOpenSendModal}
              size="lg"
              className="w-full gap-2 rounded-xl py-6 text-base font-semibold shadow-[0_0_20px_rgba(51,129,255,0.2)] hover:shadow-[0_0_20px_rgba(51,129,255,0.4)] bg-stellar-600 hover:bg-stellar-500 hover:-translate-y-1 transition-all text-white"
            >
              Open Transfer Modal <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferView;
