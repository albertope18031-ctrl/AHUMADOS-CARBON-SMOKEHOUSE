import React, { useState } from 'react';
import { Plus, Flame } from 'lucide-react';

export default function DishCard({ dish, onAddToCart, onCustomize, categoryName }) {
  const [imageFailed, setImageFailed] = useState(false);

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

  const handleImageError = (e) => {
    // 1. Intentar fallback a .png.jpg si el archivo tuviera esa extensión
    if (!e.target.dataset.triedJpg && dish.image?.endsWith('.png')) {
      e.target.dataset.triedJpg = 'true';
      e.target.src = dish.image + '.jpg';
      return;
    }
    // 2. Intentar placeholder general del restaurante
    if (!e.target.dataset.triedPlaceholder) {
      e.target.dataset.triedPlaceholder = 'true';
      e.target.src = '/images/menu/placeholder-food.png';
      return;
    }
    // 3. Renderizar fallback neutro con icono de brasa
    setImageFailed(true);
  };

  const formattedPrice = Number(dish.price || 0).toFixed(2);

  return (
    <article className="bg-charcoalCard border border-charcoalBorder rounded-2xl overflow-hidden h-full flex flex-col justify-between hover:border-flameOrange/60 transition-all duration-300 shadow-md hover:shadow-xl group">
      <div>
        {/* Cabecera visual de la imagen */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 flex items-center justify-center">
          {dish.image && !imageFailed ? (
            <img
              src={dish.image}
              alt={dish.name}
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-warmMuted/40 bg-gradient-to-b from-neutral-900 to-charcoalCard p-4 text-center select-none">
              <div className="p-3 rounded-full bg-flameOrange/10 border border-flameOrange/20 mb-2">
                <Flame className="w-8 h-8 text-flameOrange/60 animate-pulse" />
              </div>
              <span className="text-[11px] font-bold tracking-widest text-warmCream/40 uppercase">
                Ahumados & Carbón
              </span>
            </div>
          )}

          {/* Badge superior flotante sobre la imagen */}
          {dish.badge && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-charcoal/90 backdrop-blur-md text-flameOrange border border-flameOrange/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-lg inline-block">
                {dish.badge}
              </span>
            </div>
          )}

          {/* Sombra de transición hacia el contenido */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-charcoalCard to-transparent pointer-events-none" />
        </div>

        {/* Contenido descriptivo del platillo */}
        <div className="p-4 sm:p-5">
          {categoryName && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-flameOrange block mb-1">
              {categoryName}
            </span>
          )}

          <h3 className="text-warmCream font-bold text-lg leading-snug group-hover:text-warmCream transition-colors">
            {dish.name}
          </h3>

          {/* Descripción gastronómica 100% visible sin corte */}
          <p className="text-warmCream/80 text-xs sm:text-sm mt-2 leading-relaxed">
            {dish.description}
          </p>

          {/* Tags gastronómicos y dietéticos */}
          {dish.tags && dish.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {dish.tags.map((tag) => {
                const tagMap = {
                  'sin-gluten': { label: 'Sin Gluten', icon: '🌾' },
                  'picante': { label: 'Picante', icon: '🌶️' },
                  'especialidad': { label: 'Especialidad', icon: '⭐' },
                  'para-compartir': { label: 'Para Compartir', icon: '👥' },
                  'vegetariano': { label: 'Vegetariano', icon: '🥗' },
                  'ligero': { label: 'Ligero', icon: '🥗' },
                  'ahumado': { label: 'Ahumado', icon: '🪵' },
                  'top-ventas': { label: 'Top Ventas', icon: '🔥' },
                  'gourmet': { label: 'Gourmet', icon: '✨' },
                  'artesanal': { label: 'Artesanal', icon: '🍻' },
                  'bebida': { label: 'Bebida', icon: '🍺' }
                };
                const info = tagMap[tag];
                if (!info) return null;
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-charcoal/80 border border-charcoalBorder text-warmMuted font-medium"
                  >
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pie de la tarjeta: siempre alineado al fondo */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-4 border-t border-charcoalBorder/60 flex items-center justify-between gap-3">
          <div>
            <span className="text-flameOrange font-extrabold text-lg tracking-tight">
              ${formattedPrice} MXN
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddClick}
            className="bg-flameOrange hover:bg-flameOrangeHover text-warmCream text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-95 shadow-md hover:shadow-flameOrange/20"
            aria-label={`Agregar ${dish.name} a la orden`}
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </article>
  );
}
