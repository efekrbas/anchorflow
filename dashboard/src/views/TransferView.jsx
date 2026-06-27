import React from 'react';
import clsx from 'clsx';
import { Send, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useScrollReveal } from '../hooks/useScrollReveal';

const TransferView = ({ onOpenSendModal, address }) => {
  const [headerRef, headerVisible] = useScrollReveal();
  const [contentRef, contentVisible] = useScrollReveal({ rootMargin: '0px 0px -40px 0px' });

  return (
    <>
      <div 
        ref={headerRef}
        className={clsx("scroll-reveal mb-8", headerVisible && "is-visible")}
      >
        <span className="eyebrow-tag mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-stellar-400 inline-block" aria-hidden="true"></span>
          Direct Transfer
        </span>
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient-stellar">Transfer</span>
        </h2>
        <p className="text-zinc-400 mt-1.5">Send XLM payments securely via Soroban smart contract.</p>
      </div>

      {!address ? (
        <div 
          ref={contentRef}
          className={clsx("max-w-2xl mx-auto scroll-reveal", contentVisible && "is-visible")}
        >
          <div className="card-double-bezel">
            <div className="card-double-bezel-inner p-14 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center mb-5 relative z-10">
                <Send className="w-7 h-7 text-zinc-600" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2 relative z-10">Connect wallet</h3>
              <p className="text-zinc-500 max-w-sm relative z-10">You must connect your Freighter wallet to send direct transfers and manage funds.</p>
            </div>
          </div>
        </div>
      ) : (
        <div 
          ref={contentRef}
          className={clsx("max-w-2xl mx-auto scroll-reveal", contentVisible && "is-visible")}
        >
          <div className="card-double-bezel">
            <div className="card-double-bezel-inner p-8 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-stellar-500/20 to-purple-500/15 flex items-center justify-center border border-stellar-500/25 shadow-[0_0_25px_rgba(51,129,255,0.12)]">
                <Send className="w-7 h-7 text-stellar-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Direct Transfer</h3>
                <p className="text-zinc-400 text-sm mt-1">Send funds securely to any Stellar address.</p>
              </div>
            </div>

            {/* Transfer info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Network', value: 'Stellar', color: 'text-stellar-400' },
                { label: 'Contract', value: 'Soroban', color: 'text-purple-400' },
                { label: 'Speed', value: '~5s', color: 'text-emerald-400' },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-xl p-3 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">{item.label}</p>
                  <p className={`text-sm font-bold mt-1 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

              <Button 
                onClick={onOpenSendModal}
                size="lg"
                className="w-full gap-3 rounded-full py-7 text-sm font-semibold bg-gradient-to-r from-stellar-600 to-stellar-500 hover:from-stellar-500 hover:to-stellar-400 shadow-[0_0_20px_rgba(51,129,255,0.15)] hover:shadow-[0_8px_40px_rgba(51,129,255,0.35)] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white cursor-pointer border-0 relative z-10 group"
              >
                Open Transfer Modal 
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105" aria-hidden="true">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransferView;
