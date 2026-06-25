import React, { useRef } from 'react';
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

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={clsx("glass-card rounded-2xl p-6 relative overflow-hidden group hover-spotlight", delayClass)}
      style={style}
    >
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-stellar-500/10 rounded-full blur-2xl group-hover:bg-stellar-500/20 transition-all duration-500"></div>
      
      {/* Spotlight overlay */}
      <div className="spotlight-overlay"></div>

      <div className="flex items-start justify-between gap-4 relative z-10 pointer-events-none">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2 tracking-tight break-words">
            {typeof value === 'string' && value.includes('XLM') ? (
              <CountUp end={value.replace(' XLM', '')} suffix=" XLM" decimals={2} duration={2000} />
            ) : typeof value === 'number' ? (
              <CountUp end={value} duration={1500} />
            ) : (
              value
            )}
          </h3>
          {subtext && (
            <p className="text-xs font-medium text-zinc-500 mt-1">{subtext}</p>
          )}
          {trend && (
            <p className="text-xs font-medium text-emerald-400 mt-2 flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 6l-9.5 9.5-5-5L1 18" />
                <path d="M17 6h6v6" />
              </svg>
              {trend}
            </p>
          )}
        </div>
        <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-stellar-500/20 transition-all duration-300">
          <Icon className="w-6 h-6 text-stellar-400" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
