import React, { useRef } from 'react';
import { Wallet } from 'lucide-react';
import clsx from 'clsx';
import CountUp from './CountUp';

const MetricCard = ({ title, value, icon: Icon, trend, delayClass, style, subtext }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const titleId = `metric-title-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={clsx(
        "card-double-bezel group hover-spotlight metric-glow cursor-pointer",
        delayClass
      )}
      style={style}
      role="region"
      aria-labelledby={titleId}
    >
      <div className="card-double-bezel-inner p-6 h-full w-full relative overflow-hidden">
        {/* Ambient corner glow */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-stellar-500/8 rounded-full blur-3xl group-hover:bg-stellar-500/15 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-700"></div>
        
        {/* Spotlight overlay */}
        <div className="spotlight-overlay"></div>

        <div className="flex items-start justify-between gap-4 relative z-10 pointer-events-none">
          <div className="flex-1 min-w-0">
            <p id={titleId} className="text-sm font-medium text-zinc-400 tracking-wide uppercase">{title}</p>
          {value === 'Connect wallet' ? (
            <p className="text-sm font-medium text-zinc-500 mt-3 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Connect wallet
            </p>
          ) : (
            <h3 className="text-3xl font-bold text-white mt-2 tracking-tight break-words">
              {typeof value === 'string' && value.includes('XLM') ? (
                <CountUp end={value.replace(' XLM', '')} suffix=" XLM" decimals={2} duration={2000} />
              ) : typeof value === 'number' ? (
                <CountUp end={value} duration={1500} />
              ) : (
                value
              )}
            </h3>
          )}
          {subtext && value !== 'Connect wallet' && (
            <p className="text-xs font-medium text-zinc-500 mt-1.5">{subtext}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-emerald-400" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" />
                  <path d="M17 6h6v6" />
                </svg>
                <span className="text-xs font-semibold text-emerald-400">{trend}</span>
              </div>
            </div>
          )}
        </div>
        <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-stellar-500/15 to-purple-500/10 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-stellar-500/30 group-hover:shadow-[0_0_20px_rgba(51,129,255,0.15)] transition-all duration-300">
          <Icon className="w-6 h-6 text-stellar-400 group-hover:text-stellar-300 transition-colors" />
        </div>
      </div>

      {/* Bottom mini sparkline */}
      <div className="mt-4 relative z-10 pointer-events-none">
        <svg className="w-full h-8 opacity-30 group-hover:opacity-50 transition-opacity" viewBox="0 0 200 32" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3381FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3381FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 28 L20 24 L40 26 L60 18 L80 20 L100 14 L120 16 L140 10 L160 12 L180 6 L200 8" 
            fill="none" stroke="#3381FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 28 L20 24 L40 26 L60 18 L80 20 L100 14 L120 16 L140 10 L160 12 L180 6 L200 8 L200 32 L0 32 Z" 
            fill="url(#sparkGrad)" />
        </svg>
      </div>
      </div>
    </div>
  );
};

export default MetricCard;
