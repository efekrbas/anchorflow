import React from 'react';
import { Send } from 'lucide-react';

const TransferView = ({ onOpenSendModal }) => {
  return (
    <div className="animate-fade-in max-w-2xl mx-auto mt-8">
      <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-stellar-500/20 flex items-center justify-center border border-stellar-500/30">
            <Send className="w-7 h-7 text-stellar-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Direct Transfer</h2>
            <p className="text-zinc-400 text-sm mt-1">Send funds securely to any stellar address.</p>
          </div>
        </div>
        <button 
          onClick={onOpenSendModal}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all shadow-lg bg-stellar-600 hover:bg-stellar-500 hover:-translate-y-1 btn-primary"
        >
          Open Transfer Modal <Send className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default TransferView;
