import React from 'react';
import { Flame, Receipt, ArrowRight } from 'lucide-react';

export default function MobileBottomCart({
  cart = [],
  totalItems: controlledTotalItems,
  totalAmount: controlledTotalAmount,
  onOpenCart,
  activeOrder = null,
  onOpenActiveTicket
}) {
  const totalItems =
    controlledTotalItems !== undefined
      ? controlledTotalItems
      : cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount =
    controlledTotalAmount !== undefined
      ? controlledTotalAmount
      : cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Si hay productos en el carrito, mostrar botón principal de la orden actual
  if (totalItems > 0) {
    const formattedAmount = Number(totalAmount || 0).toFixed(2);
    return (
      <div className="fixed bottom-4 inset-x-3 z-50 md:hidden animate-in slide-in-from-bottom-5 duration-300">
        <button
          type="button"
          onClick={onOpenCart}
          className="bg-flameOrange hover:bg-flameOrangeHover text-warmCream font-bold py-3.5 px-5 rounded-2xl shadow-2xl flex items-center justify-between w-full border border-flameOrange/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          aria-label={`Ver orden con ${totalItems} platillos`}
        >
          {/* Izquierda: Cantidad de platillos */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold tracking-wide">
            <span>🛒 {totalItems} {totalItems === 1 ? 'platillo' : 'platillos'}</span>
          </div>

          {/* Centro: Título de acción */}
          <div className="text-xs sm:text-sm font-black uppercase tracking-wider">
            {activeOrder ? 'Pedir Ronda' : 'Ver Orden'}
          </div>

          {/* Derecha: Total acumulado */}
          <div className="text-xs sm:text-sm font-black tracking-tight">
            ${formattedAmount} MXN →
          </div>
        </button>
      </div>
    );
  }

  // Si el carrito está vacío pero hay una comanda activa en la mesa, mostrar acceso flotante al ticket
  if (activeOrder) {
    return (
      <div className="fixed bottom-4 inset-x-3 z-50 md:hidden animate-in slide-in-from-bottom-5 duration-300">
        <button
          type="button"
          onClick={onOpenActiveTicket}
          className="bg-charcoalCard/95 hover:bg-[#282828] text-warmCream font-bold py-3 px-4 rounded-2xl shadow-2xl flex items-center justify-between w-full border border-badgeGold/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          aria-label="Ver ticket activo de la comanda"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-badgeGold/10 text-badgeGold">
              <Receipt className="w-4 h-4" />
            </span>
            <div className="text-left leading-tight">
              <span className="text-xs font-black text-warmCream block">
                Mesa #{activeOrder.tableNumber} • Comanda en Cocina
              </span>
              <span className="text-[10px] text-badgeGold font-mono font-semibold">
                Folio {activeOrder.folio}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-flameOrange">
            <span>Ver Ticket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    );
  }

  return null;
}
