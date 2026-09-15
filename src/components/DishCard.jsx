import React from 'react';
import { Plus } from 'lucide-react';

export default function DishCard({ dish, onAddToCart, onCustomize }) {
  if (!dish) return null;

  const handleAddClick = () => {
    // Si requiere término o tiene guarnición incluida, abrimos el modal de personalización
    if (dish.requiresCookingPoint || dish.hasSideOptions) {
      if (onCustomize) {
        onCustomize(dish);
      }
    } else {
      // Platillos directos (entradas simples, cervezas, etc.)
      if (onAddToCart) {
        onAddToCart({
          ...dish,
          quantity: 1,
          selectedCookingPoint: null,
          selectedSide: null,
          notes: ''
        });
      }
    }
  };

  const formattedPrice = Number(dish.price || 0).toFixed(2);

  return (
    <article className="bg-charcoalCard border border-charcoalBorder rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-flameOrange/60 transition-all duration-200 shadow-md group">
      <div>
        {/* Badge superior si existe */}
        {dish.badge && (
          <span className="bg-flameOrange/15 text-flameOrange border border-flameOrange/30 text-[11px] font-bold px-2 py-0.5 rounded-full inline-block self-start mb-2">
            {dish.badge}
          </span>
        )}

        {/* Título del platillo */}
        <h3 className="text-warmCream font-bold text-lg leading-snug">
          {dish.name}
        </h3>

        {/* Descripción gastronómica */}
        <p className="text-warmMuted text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
          {dish.description}
        </p>
      </div>

      {/* Pie de la tarjeta */}
      <div className="mt-5 pt-4 border-t border-charcoalBorder/60 flex items-center justify-between gap-3">
        <div>
          <span className="text-flameOrange font-extrabold text-lg tracking-tight">
            ${formattedPrice} MXN
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddClick}
          className="bg-flameOrange hover:bg-flameOrangeHover text-warmCream text-xs sm:text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-sm"
          aria-label={`Agregar ${dish.name} a la orden`}
        >
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </button>
      </div>
    </article>
  );
}
