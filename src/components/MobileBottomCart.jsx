import React from 'react';

export default function MobileBottomCart({
  cart = [],
  totalItems: controlledTotalItems,
  totalAmount: controlledTotalAmount,
  onOpenCart
}) {
  const totalItems =
    controlledTotalItems !== undefined
      ? controlledTotalItems
      : cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount =
    controlledTotalAmount !== undefined
      ? controlledTotalAmount
      : cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Solo se muestra si hay al menos 1 platillo en el carrito
  if (totalItems === 0 || cart.length === 0) {
    return null;
  }

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
          Ver Orden
        </div>

        {/* Derecha: Total acumulado */}
        <div className="text-xs sm:text-sm font-black tracking-tight">
          ${formattedAmount} MXN →
        </div>
      </button>
    </div>
  );
}
