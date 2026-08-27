import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSecurity();

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          let icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
          let borderClass = 'border-cyan-500/40 bg-[#10172A] shadow-lg';
          
          if (toast.type === 'danger') {
            icon = <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />;
            borderClass = 'border-red-500/50 bg-[#10172A] shadow-lg';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
            borderClass = 'border-amber-500/50 bg-[#10172A] shadow-lg';
          } else if (toast.type === 'success') {
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            borderClass = 'border-emerald-500/50 bg-[#10172A] shadow-lg';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 rounded-lg border flex items-start gap-3 text-slate-100 ${borderClass}`}
            >
              <div className="pt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold tracking-wide text-slate-100">{toast.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words font-mono">{toast.message}</p>
              </div>
              <button
                id={`dismiss-toast-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-[#0A0F1E]"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
