import React from 'react';
import { Clock } from 'lucide-react';

export default function UnifiedBottomBar({
  orderType = 'mesa',
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
  onCallWaiter,
  onRequestBill,
  cooldownSeconds = 0,
  activeOrder = null,
  onOpenActiveTicket
}) {
  const isMesa = orderType === 'mesa';
  const isCooldownActive = cooldownSeconds > 0;
  const formattedTotal = Number(cartTotal || 0).toFixed(2);

  // Estados del botón principal:
  // Estado A: Armando pedido (cartCount > 0)
  // Estado B: Comanda activa enviada a cocina (cartCount === 0 && Boolean(activeOrder))
  // Estado Neutro: Carrito vacío sin comanda activa (cartCount === 0 && !activeOrder)
  const hasCartItems = cartCount > 0;
  const hasActiveComanda = !hasCartItems && Boolean(activeOrder);

  const handleMainButtonClick = () => {
    if (hasActiveComanda) {
      if (onOpenActiveTicket) onOpenActiveTicket();
    } else {
      if (onOpenCart) onOpenCart();
    }
  };

  return (
    <nav
      aria-label="Barra de acciones principales"
      className="fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-3.5 py-3 z-40 shadow-2xl"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-3 w-full">
        {/* A la izquierda: Botones compactos de asistencia para mesa (solo visibles en modo 'En Mesa') */}
        {isMesa && (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Botón 1: 🔔 Mesero */}
            <button
              type="button"
              onClick={onCallWaiter}
              disabled={isCooldownActive}
              className={`h-12 sm:h-14 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none ${
                isCooldownActive
                  ? 'bg-neutral-900 text-flameOrange/80 border border-flameOrange/30 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-warmCream border border-neutral-800 hover:border-flameOrange/50 active:scale-95'
              }`}
              title={isCooldownActive ? `Mesero en camino (${cooldownSeconds}s)` : 'Llamar al mesero a la mesa'}
              aria-label="Llamar Mesero"
            >
              {isCooldownActive ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-flameOrange flex-shrink-0" />
                  <span className="hidden sm:inline">En camino ({cooldownSeconds}s)</span>
                  <span className="sm:hidden text-[11px]">({cooldownSeconds}s)</span>
                </>
              ) : (
                <>
                  <span className="text-base leading-none">🔔</span>
                  <span>Mesero</span>
                </>
              )}
            </button>

            {/* Botón 2: 🧾 Cuenta */}
            <button
              type="button"
              onClick={onRequestBill}
              className="h-12 sm:h-14 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-warmCream border border-neutral-800 hover:border-emerald-500/50 active:scale-95 transition-all cursor-pointer shadow-md select-none"
              title="Solicitar la cuenta a la mesa"
              aria-label="Pedir la Cuenta"
            >
              <span className="text-base leading-none">🧾</span>
              <span>Cuenta</span>
            </button>
          </div>
        )}

        {/* A la derecha: Botón principal unificado de acceso a la orden */}
        <div className="flex-1 flex justify-end">
          {hasCartItems ? (
            /* Estado A: Armando pedido / Carrito con platillos */
            <button
              type="button"
              onClick={handleMainButtonClick}
              className="w-full sm:w-auto min-w-[200px] h-12 sm:h-14 px-4 sm:px-6 rounded-2xl bg-flameOrange hover:bg-flameOrangeHover text-warmCream font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-flameOrange/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
              aria-label={`Ver orden con ${cartCount} productos`}
            >
              <span className="text-base leading-none">🛒</span>
              <span className="truncate">
                Ver Orden ({cartCount}) • ${formattedTotal} MXN
              </span>
            </button>
          ) : hasActiveComanda ? (
            /* Estado B: Comanda enviada a cocina */
            <button
              type="button"
              onClick={handleMainButtonClick}
              className="w-full sm:w-auto min-w-[220px] h-12 sm:h-14 px-4 sm:px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border-2 border-amber-500/70 hover:border-amber-400 text-warmCream font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-500/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
              aria-label={`Comanda activa ${activeOrder.folio}. Ver ticket`}
            >
              {/* Indicador visual activo: punto verde pulsante */}
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-base leading-none flex-shrink-0">🔥</span>
              <span className="truncate">
                Comanda Activa ({activeOrder.folio}) • Ver Ticket
              </span>
            </button>
          ) : (
            /* Estado Neutro: Carrito vacío sin comanda */
            <button
              type="button"
              onClick={handleMainButtonClick}
              className="w-full sm:w-auto min-w-[170px] h-12 sm:h-14 px-4 sm:px-6 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-warmCream font-bold text-xs sm:text-sm active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
              aria-label="Orden vacía"
            >
              <span className="text-base leading-none opacity-60">🛒</span>
              <span className="truncate">Orden vacía</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
