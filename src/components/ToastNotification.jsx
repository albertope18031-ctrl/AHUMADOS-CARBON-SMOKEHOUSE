import React, { useEffect } from 'react';
import { CheckCircle2, Bell, Receipt, X } from 'lucide-react';

export default function ToastNotification({
  toast,
  onClose
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    waiter: <Bell className="w-5 h-5 text-badgeGold animate-bounce" />,
    bill: <Receipt className="w-5 h-5 text-emerald-400 animate-pulse" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
  };

  return (
    <div className="fixed top-24 inset-x-4 max-w-md mx-auto z-50 pointer-events-none animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="pointer-events-auto bg-[#171717]/95 backdrop-blur-md border border-charcoalBorder shadow-2xl rounded-2xl p-4 flex items-start gap-3.5 text-warmCream">
        <div className="p-2 rounded-xl bg-charcoalCard border border-charcoalBorder flex-shrink-0">
          {icons[toast.type] || icons.success}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <h4 className="text-sm font-bold text-warmCream leading-tight">
            {toast.title || 'Solicitud de Servicio'}
          </h4>
          <p className="text-xs text-warmMuted mt-1 leading-relaxed">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-warmMuted hover:text-warmCream hover:bg-charcoalCard transition-colors cursor-pointer flex-shrink-0"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
