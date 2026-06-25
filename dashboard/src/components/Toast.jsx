import React from 'react';
import clsx from 'clsx';

const Toast = ({ toast }) => {
  return (
    <div className={clsx(
      "fixed bottom-6 right-6 z-50 transition-all duration-300 transform",
      toast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
    )}>
      {toast && (
        <div className={clsx(
          "glass-card px-5 py-3 rounded-xl flex items-center gap-3 border shadow-2xl",
          toast.type === 'error' ? "border-red-500/30 text-red-100" : "border-emerald-500/30 text-emerald-100"
        )}>
          <div className={clsx(
            "w-2 h-2 rounded-full",
            toast.type === 'error' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
          )}></div>
          <p className="font-medium text-sm">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default Toast;
