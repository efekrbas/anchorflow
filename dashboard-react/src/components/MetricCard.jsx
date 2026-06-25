import React from 'react';
import clsx from 'clsx';

const MetricCard = ({ title, value, icon: Icon, trend, delayClass }) => {
  return (
    <div className={clsx("glass-card rounded-2xl p-6 relative overflow-hidden group", delayClass)}>
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-stellar-500/10 rounded-full blur-2xl group-hover:bg-stellar-500/20 transition-all duration-500"></div>
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2 tracking-tight break-words">{value}</h3>
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
