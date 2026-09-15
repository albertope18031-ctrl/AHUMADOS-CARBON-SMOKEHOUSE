import React, { useState, useRef, useEffect } from 'react';
import { Plus, Flame, Check } from 'lucide-react';

/**
 * Determina las insignias prioritarias a mostrar en la tarjeta (MÁXIMO 2):
 * - Prioridad 1 (Comercial): ⭐ Top Ventas o 🔥 Especialidad
 * - Prioridad 2 (Dietética / Alérgenos): 🌾 Sin Gluten o 🌶️ Picante
 */
const getPriorityBadges = (dish) => {
  const badges = [];

  // Prioridad 1: Comercial
  if (
    dish.isTopSeller ||
    dish.tags?.includes('top-ventas') ||
    (dish.badge && /top/i.test(dish.badge))
  ) {
    badges.push({ label: 'Top Ventas', icon: '⭐' });
  } else if (
    dish.isSpecialty ||
    dish.tags?.includes('especialidad') ||
    (dish.badge && /especialidad/i.test(dish.badge))
  ) {
    badges.push({ label: 'Especialidad', icon: '🔥' });
  }

  // Prioridad 2: Dietética / Alérgenos
  if (dish.tags?.includes('sin-gluten')) {
    badges.push({ label: 'Sin Gluten', icon: '🌾' });
  } else if (dish.tags?.includes('picante')) {
    badges.push({ label: 'Picante', icon: '🌶️' });
  }

  return badges.slice(0, 2);
};

/**
 * Obtiene la porción o gramaje del platillo de forma limpia
 */
const getPortion = (dish) => {
  if (dish.portion) return dish.portion;
  const match = dish.name.match(/\(([^)]+)\)$/);
  return match ? match[1] : null;
};

/**
 * Obtiene el nombre del platillo sin texto redundante de porción entre paréntesis
 */
const getCleanName = (dish) => {
  return dish.name.replace(/\s*\([^)]*\)$/, '').trim();
};

export default function DishCard({ dish, onAddToCart, onCustomize, categoryName }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!dish) return null;

  // Interacción táctil en toda la tarjeta -> Abre modal de detalle y personalización
  const handleCardClick = () => {
    if (onCustomize) {
      onCustomize(dish);
    }
  };

  // Botón directo "+ Agregar"
  const handleAddClick = (e) => {
    e.stopPropagation(); // Evita que se propague el evento al contenedor de la tarjeta

    // Si requiere término o tiene guarnición incluida, abrimos el modal de personalización
    if (dish.requiresCookingPoint || dish.hasSideOptions) {
      if (onCustomize) {
        onCustomize(dish);
      }
      return;
    }

    // Platillo directo (entradas simples, bebidas, etc.)
    if (onAddToCart) {
      onAddToCart({
        ...dish,
        quantity: 1,
        selectedCookingPoint: null,
        selectedSide: null,
        notes: ''
      });
    }

    // Micro-interacción visual de confirmación inmediata
    setIsAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleImageError = (e) => {
    if (!e.target.dataset.triedJpg && dish.image?.endsWith('.png')) {
      e.target.dataset.triedJpg = 'true';
      e.target.src = dish.image + '.jpg';
      return;
    }
    if (!e.target.dataset.triedPlaceholder) {
      e.target.dataset.triedPlaceholder = 'true';
      e.target.src = '/images/menu/placeholder-food.png';
      return;
    }
    setImageFailed(true);
  };

  const priorityBadges = getPriorityBadges(dish);
  const portionText = getPortion(dish);
  const cleanName = getCleanName(dish);
  const formattedPrice = Number(dish.price || 0).toFixed(2);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden h-full flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl group cursor-pointer text-left select-none relative focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      aria-label={`Ver detalle de ${cleanName}`}
    >
      <div>
        {/* 1. Fotografía optimizada con esquinas redondeadas y aspect ratio uniforme */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900 flex items-center justify-center">
          {dish.image && !imageFailed ? (
            <img
              src={dish.image}
              alt={dish.name}
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-warmMuted/40 bg-gradient-to-b from-neutral-900 to-neutral-900/90 p-4 text-center select-none">
              <div className="p-2.5 rounded-full bg-flameOrange/10 border border-flameOrange/20 mb-1.5">
                <Flame className="w-6 h-6 text-flameOrange/60 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-warmCream/40 uppercase">
                Ahumados & Carbón
              </span>
            </div>
          )}

          {/* Insignias prioritarias depuradas (MÁXIMO 1 o 2) */}
          {priorityBadges.length > 0 && (
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
              {priorityBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/60 text-amber-400 shadow-md flex items-center gap-1"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>
          )}

          {/* Indicador sutil de personalización / ver detalle */}
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-neutral-300 border border-white/10">
              Ver detalle
            </span>
          </div>

          {/* Sombra de transición hacia el contenido */}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-neutral-900/90 to-transparent pointer-events-none" />
        </div>

        {/* Contenido descriptivo del platillo */}
        <div className="p-4 sm:p-5">
          {categoryName && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-flameOrange block mb-1">
              {categoryName}
            </span>
          )}

          {/* 2 & 3. Título del platillo con tipografía limpia en blanco + Gramaje/Porción */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
              {cleanName}
            </h3>
            {portionText && (
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-800/90 border border-neutral-700/60 text-neutral-300 shrink-0 mt-0.5 whitespace-nowrap">
                {portionText}
              </span>
            )}
          </div>

          {/* 4. Descripción breve y apetitosa (limitada a 2 líneas con line-clamp-2 para emparejar tarjetas) */}
          <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-2">
            {dish.description}
          </p>
        </div>
      </div>

      {/* 5. Pie de la tarjeta: Precio destacado + Botón de acción con micro-interacción */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3.5 border-t border-neutral-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-neutral-500 block font-medium uppercase tracking-wider">
              Precio
            </span>
            <span className="text-base sm:text-lg font-bold text-amber-400 tracking-tight">
              ${formattedPrice} <span className="text-xs font-normal text-neutral-400">MXN</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddClick}
            className={`relative text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-300 cursor-pointer active:scale-95 shadow-md ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-900/40 scale-105'
                : 'bg-flameOrange hover:bg-flameOrangeHover text-white shadow-flameOrange/20 hover:shadow-flameOrange/40'
            }`}
            aria-label={isAdded ? `${cleanName} agregado a la orden` : `Agregar ${cleanName} a la orden`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-white animate-in zoom-in-50 duration-200" />
                <span className="animate-in fade-in duration-200">¡Agregado!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
