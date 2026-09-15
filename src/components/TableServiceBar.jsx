import React from 'react';
import { Clock } from 'lucide-react';

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
    <>
      {/* 1. Versión Móvil: Opción A (Píldora flotante compacta con Backdrop Blur)
          Se muestra en móviles ÚNICAMENTE cuando el carrito está vacío para evitar solapamiento */}
      {!hasBottomCart && (
        <aside
          aria-label="Acciones rápidas de servicio en mesa"
          className="fixed z-30 inset-x-0 bottom-0 px-4 pt-1 pb-4 flex justify-center md:hidden pointer-events-none animate-in slide-in-from-bottom-3 duration-300"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
        >
          <div className="w-full max-w-sm pointer-events-auto bg-neutral-950/85 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl p-2 flex items-center justify-between gap-2">
            {/* Botón 1: Llamar Mesero */}
            <button
              type="button"
              onClick={onCallWaiter}
              disabled={isCooldownActive}
              className={`flex-1 h-10 px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md select-none ${
                isCooldownActive
                  ? 'bg-neutral-900 text-flameOrange/90 border border-flameOrange/30 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-warmCream border border-neutral-800 hover:border-flameOrange/50 active:scale-95'
              }`}
              aria-label={isCooldownActive ? `Mesero solicitado. Espera ${cooldownSeconds}s` : 'Llamar al mesero a la mesa'}
            >
              {isCooldownActive ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin text-flameOrange" />
                  <span className="truncate">En camino ({cooldownSeconds}s)</span>
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
              className="flex-1 h-10 px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-warmCream border border-neutral-800 hover:border-emerald-500/50 active:scale-95 transition-all cursor-pointer shadow-md select-none"
              aria-label="Pedir la cuenta en mesa"
            >
              <span className="text-base leading-none">🧾</span>
              <span className="truncate">Pedir Cuenta</span>
            </button>
          </div>
        </aside>
      )}

      {/* 2. Versión de Escritorio (Desktop): Posición fija no intrusiva en esquina inferior izquierda */}
      <aside
        aria-label="Acciones de mesa en escritorio"
        className="hidden md:block fixed bottom-6 left-6 z-40 max-w-sm animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded-2xl p-2 shadow-2xl flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCallWaiter}
            disabled={isCooldownActive}
            className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md select-none ${
              isCooldownActive
                ? 'bg-neutral-900 text-flameOrange/90 border border-flameOrange/30 cursor-not-allowed'
                : 'bg-neutral-900 hover:bg-neutral-800 text-warmCream border border-neutral-800 hover:border-flameOrange/50 active:scale-95'
            }`}
          >
            {isCooldownActive ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-flameOrange" />
                <span>Mesero en camino ({cooldownSeconds}s)</span>
              </>
            ) : (
              <>
                <span className="text-base leading-none">🛎️</span>
                <span>Llamar Mesero</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRequestBill}
            className="h-10 px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-warmCream border border-neutral-800 hover:border-emerald-500/50 active:scale-95 transition-all cursor-pointer shadow-md select-none"
          >
            <span className="text-base leading-none">🧾</span>
            <span>Pedir Cuenta</span>
          </button>
        </div>
      </aside>
    </>
  );
}
