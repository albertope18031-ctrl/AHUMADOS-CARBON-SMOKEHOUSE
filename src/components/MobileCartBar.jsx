import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function MobileCartBar({
  cartCount = 0,
  cartTotal = 0,
  onOpenCart
}) {
  // Solo debe mostrarse si hay al menos 1 producto en el carrito
  if (cartCount === 0) return null;

  const formattedTotal =
    typeof cartTotal === 'number'
      ? cartTotal.toFixed(2)
      : Number(cartTotal || 0).toFixed(2);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-charcoal/95 backdrop-blur-md border-t border-charcoalBorder shadow-2xl animate-in slide-in-from-bottom duration-300">
      <button
        type="button"
        onClick={onOpenCart}
        className="w-full bg-flameOrange hover:bg-flameOrangeHover active:scale-[0.98] text-warmCream font-bold py-3.5 px-4 rounded-xl flex items-center justify-between shadow-lg transition-all cursor-pointer"
        aria-label={`Ver orden con ${cartCount} productos`}
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-black/20 p-1.5 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-warmCream" />
          </div>
          <span className="text-sm sm:text-base font-extrabold tracking-wide">
            Ver Orden ({cartCount})
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm sm:text-base font-black">
          <span>• ${formattedTotal} MXN</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </button>
    </div>
  );
}
