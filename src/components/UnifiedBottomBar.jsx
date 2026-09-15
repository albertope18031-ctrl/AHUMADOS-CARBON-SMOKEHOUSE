import React from 'react';
import { ShoppingBag, Clock, Receipt } from 'lucide-react';

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

  return (
    <nav
      aria-label="Barra de acciones principales"
      className="fixed bottom-0 inset-x-0 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800 px-4 py-3 z-40 shadow-2xl"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 w-full">
        {/* A la izquierda: Botones compactos de asistencia para mesa (solo visibles en modo 'En Mesa') */}
        {isMesa && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Botón 1: 🔔 Mesero */}
            <button
              type="button"
              onClick={onCallWaiter}
              disabled={isCooldownActive}
              className={`h-11 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none ${
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
                  <span className="sm:hidden">({cooldownSeconds}s)</span>
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
              className="h-11 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-warmCream border border-neutral-800 hover:border-emerald-500/50 active:scale-95 transition-all cursor-pointer shadow-md select-none"
              title="Solicitar la cuenta a la mesa"
              aria-label="Pedir la Cuenta"
            >
              <span className="text-base leading-none">🧾</span>
              <span>Cuenta</span>
            </button>
          </div>
        )}

        {/* A la derecha: Botón principal del carrito expandido o ajustado */}
        <div className={`flex items-center gap-2 flex-1 justify-end ${!isMesa ? 'w-full' : ''}`}>
          {/* Si hay comanda activa ya enviada y el carrito está vacío */}
          {activeOrder && cartCount === 0 && (
            <button
              type="button"
              onClick={onOpenActiveTicket}
              className="h-11 px-3 sm:px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 truncate"
              title="Ver ticket digital de comanda activa"
            >
              <Receipt className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="hidden xs:inline truncate">Ticket {activeOrder.folio}</span>
              <span className="xs:hidden">Ticket</span>
            </button>
          )}

          {/* Botón Principal: Ver Orden */}
          <button
            type="button"
            onClick={onOpenCart}
            className={`h-11 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 select-none ${
              cartCount > 0
                ? 'bg-flameOrange hover:bg-flameOrangeHover text-warmCream shadow-flameOrange/25 flex-1 sm:flex-initial'
                : 'bg-neutral-900 hover:bg-neutral-800 text-warmMuted hover:text-warmCream border border-neutral-800'
            }`}
            aria-label={`Ver orden con ${cartCount} productos`}
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              Ver Orden ({cartCount}) • ${formattedTotal} MXN
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
