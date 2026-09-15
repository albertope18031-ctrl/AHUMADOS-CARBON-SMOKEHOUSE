import React, { useState } from 'react';
import { Receipt, ArrowRight, ChevronUp, Clock } from 'lucide-react';

export default function MobileBottomCart({
  cart = [],
  totalItems: controlledTotalItems,
  totalAmount: controlledTotalAmount,
  onOpenCart,
  activeOrder = null,
  onOpenActiveTicket,
  // Props opcionales de asistencia en mesa para convivencia modular armónica
  isTableServiceVisible = false,
  tableNumber = '',
  onCallWaiter,
  onRequestBill,
  cooldownSeconds = 0
}) {
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);

  const totalItems =
    controlledTotalItems !== undefined
      ? controlledTotalItems
      : cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount =
    controlledTotalAmount !== undefined
      ? controlledTotalAmount
      : cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Si no hay productos en carrito y tampoco comanda activa, no se renderiza este dock
  if (totalItems <= 0 && !activeOrder) {
    return null;
  }

  const formattedAmount = Number(totalAmount || 0).toFixed(2);
  const isCooldownActive = cooldownSeconds > 0;

  return (
    <div
      className="fixed z-40 inset-x-0 bottom-0 px-3 pt-1 flex justify-center md:hidden pointer-events-none animate-in slide-in-from-bottom-5 duration-300"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
    >
      <div className="w-full max-w-md pointer-events-auto flex items-center gap-2">
        {/* Opción B: FAB / Botón Flotante Desplegable en Esquina Izquierda
            Se integra en la misma fila con el carrito para evitar sobrecargar la pantalla */}
        {isTableServiceVisible && (
          <div className="relative">
            {/* Overlay invisible para cerrar el menú al hacer clic fuera */}
            {isServiceMenuOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsServiceMenuOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Menú emergente hacia arriba con las 2 acciones de atención en sala */}
            {isServiceMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2.5 w-52 bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-2 space-y-1.5 animate-in slide-in-from-bottom-2 duration-150 z-50">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-warmMuted/80 border-b border-neutral-800/80 mb-1 flex items-center justify-between">
                  <span>Atención en Sala</span>
                  {tableNumber && <span className="text-flameOrange">Mesa #{tableNumber}</span>}
                </div>

                {/* Opción 1: Llamar Mesero */}
                <button
                  type="button"
                  onClick={() => {
                    setIsServiceMenuOpen(false);
                    if (onCallWaiter) onCallWaiter();
                  }}
                  disabled={isCooldownActive}
                  className={`w-full h-10 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isCooldownActive
                      ? 'bg-neutral-900 text-flameOrange/70 border border-flameOrange/20 cursor-not-allowed'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-warmCream border border-neutral-800 hover:border-flameOrange/40 active:scale-95'
                  }`}
                >
                  {isCooldownActive ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin text-flameOrange flex-shrink-0" />
                      <span className="truncate">Mesero en camino ({cooldownSeconds}s)</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base leading-none">🛎️</span>
                      <span className="truncate">Llamar Mesero</span>
                    </>
                  )}
                </button>

                {/* Opción 2: Pedir Cuenta */}
                <button
                  type="button"
                  onClick={() => {
                    setIsServiceMenuOpen(false);
                    if (onRequestBill) onRequestBill();
                  }}
                  className="w-full h-10 px-3 rounded-xl text-xs font-bold flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-warmCream border border-neutral-800 hover:border-emerald-500/40 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-base leading-none">🧾</span>
                  <span className="truncate">Pedir la Cuenta</span>
                </button>
              </div>
            )}

            {/* Botón Píldora de Mesa en esquina */}
            <button
              type="button"
              onClick={() => setIsServiceMenuOpen(!isServiceMenuOpen)}
              className="h-12 px-3 rounded-2xl bg-neutral-950/90 backdrop-blur-md border border-neutral-800 hover:border-flameOrange/50 text-warmCream shadow-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer flex-shrink-0"
              aria-label="Abrir opciones de atención en mesa"
            >
              <span className="text-base leading-none">🛎️</span>
              <span className="text-xs font-bold whitespace-nowrap">
                {tableNumber ? `Mesa ${tableNumber}` : 'Mesa'}
              </span>
              <ChevronUp
                className={`w-3.5 h-3.5 text-warmMuted transition-transform duration-200 ${
                  isServiceMenuOpen ? 'rotate-180 text-flameOrange' : ''
                }`}
              />
            </button>
          </div>
        )}

        {/* Botón Principal: Ver Orden Actual */}
        {totalItems > 0 ? (
          <button
            type="button"
            onClick={onOpenCart}
            className="h-12 flex-1 bg-flameOrange hover:bg-flameOrangeHover text-warmCream font-bold px-4 rounded-2xl shadow-xl flex items-center justify-between border border-flameOrange/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            aria-label={`Ver orden con ${totalItems} platillos`}
          >
            <div className="flex items-center gap-1 text-xs font-extrabold tracking-wide">
              <span>🛒 {totalItems}</span>
            </div>

            <div className="text-xs font-black uppercase tracking-wider">
              {activeOrder ? 'Pedir Ronda' : 'Ver Orden'}
            </div>

            <div className="text-xs font-black tracking-tight">
              ${formattedAmount} MXN →
            </div>
          </button>
        ) : activeOrder ? (
          /* Botón Secundario si el carrito está vacío pero hay comanda activa */
          <button
            type="button"
            onClick={onOpenActiveTicket}
            className="h-12 flex-1 bg-charcoalCard/95 hover:bg-[#282828] text-warmCream font-bold px-4 rounded-2xl shadow-xl flex items-center justify-between border border-badgeGold/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            aria-label="Ver ticket activo de la comanda"
          >
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-badgeGold/10 text-badgeGold">
                <Receipt className="w-3.5 h-3.5" />
              </span>
              <div className="text-left leading-tight">
                <span className="text-xs font-black text-warmCream block truncate">
                  Comanda {activeOrder.folio}
                </span>
                <span className="text-[10px] text-badgeGold font-mono font-semibold">
                  Mesa #{activeOrder.tableNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-flameOrange">
              <span>Ver Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ) : null}
      </div>
    </div>
  );
}
