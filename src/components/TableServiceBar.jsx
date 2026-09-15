import React from 'react';
import { Bell, Receipt, Clock } from 'lucide-react';

export default function TableServiceBar({
  isVisible = true,
  tableNumber = '',
  onCallWaiter,
  onRequestBill,
  hasBottomCart = false,
  cooldownSeconds = 0
}) {
  if (!isVisible) return null;

  const isCooldownActive = cooldownSeconds > 0;

  return (
    <aside
      aria-label="Acciones rápidas de servicio en mesa"
      className={`fixed z-40 transition-all duration-300 inset-x-3 md:inset-x-auto md:left-6 md:bottom-6 max-w-sm ${
        hasBottomCart ? 'bottom-[76px]' : 'bottom-4'
      }`}
    >
      <div className="bg-[#141414]/95 backdrop-blur-md border border-charcoalBorder/90 rounded-2xl p-1.5 shadow-2xl flex items-center gap-2">
        {/* Botón 1: Llamar Mesero */}
        <button
          type="button"
          onClick={onCallWaiter}
          disabled={isCooldownActive}
          className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md select-none ${
            isCooldownActive
              ? 'bg-[#1e1e1e] text-flameOrange/90 border border-flameOrange/30 cursor-not-allowed'
              : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-warmCream border border-charcoalBorder hover:border-flameOrange/50 active:scale-95'
          }`}
          aria-label={isCooldownActive ? `Mesero solicitado. Espera ${cooldownSeconds}s` : 'Llamar al mesero a la mesa'}
        >
          {isCooldownActive ? (
            <>
              <Clock className="w-4 h-4 animate-spin text-flameOrange" />
              <span className="truncate">Mesero en camino ({cooldownSeconds}s)</span>
            </>
          ) : (
            <>
              <span className="text-base leading-none">🛎️</span>
              <span className="truncate">Llamar Mesero</span>
            </>
          )}
        </button>

        {/* Botón 2: Pedir la Cuenta */}
        <button
          type="button"
          onClick={onRequestBill}
          className="flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-warmCream border border-charcoalBorder hover:border-emerald-500/50 active:scale-95 transition-all cursor-pointer shadow-md select-none"
          aria-label="Pedir la cuenta en mesa"
        >
          <span className="text-base leading-none">🧾</span>
          <span className="truncate">Pedir Cuenta</span>
        </button>
      </div>
    </aside>
  );
}
