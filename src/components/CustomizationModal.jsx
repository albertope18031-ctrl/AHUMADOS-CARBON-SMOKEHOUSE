import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Flame, Utensils } from 'lucide-react';
import { COOKING_POINTS, SIDE_OPTIONS } from '../data/menuData';

export default function CustomizationModal({
  isOpen,
  dish,
  onClose,
  onConfirm
}) {
  const [selectedCookingPoint, setSelectedCookingPoint] = useState('');
  const [selectedSide, setSelectedSide] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [modalImageFailed, setModalImageFailed] = useState(false);

  // Inicializar o restablecer estados cada vez que se selecciona un platillo
  useEffect(() => {
    if (dish) {
      setSelectedCookingPoint(COOKING_POINTS[0] || '');
      setSelectedSide(SIDE_OPTIONS[0] || '');
      setNotes('');
      setQuantity(1);
      setModalImageFailed(false);
    }
  }, [dish]);

  // Manejador de tecla Escape para accesibilidad
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !dish) return null;

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleModalImageError = (e) => {
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
    setModalImageFailed(true);
  };

  const totalPrice = (Number(dish.price || 0) * quantity).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm({
        ...dish,
        quantity,
        selectedCookingPoint: dish.requiresCookingPoint ? selectedCookingPoint : null,
        selectedSide: dish.hasSideOptions ? selectedSide : null,
        notes: notes.trim(),
        totalPrice: Number(dish.price || 0) * quantity
      });
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 transition-all"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dish-title"
    >
      <div className="bg-charcoalCard border border-charcoalBorder rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto text-warmCream shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Encabezado visual con Imagen PNG y degradado oscuro inferior */}
        {dish.image && !modalImageFailed ? (
          <div className="relative w-full h-52 sm:h-64 overflow-hidden rounded-t-2xl bg-neutral-900">
            <img
              src={dish.image}
              alt={dish.name}
              loading="lazy"
              onError={handleModalImageError}
              className="w-full h-full object-cover"
            />
            {/* Degradado oscuro inferior para garantizar lectura de títulos y precios */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoalCard via-charcoalCard/40 to-black/40 pointer-events-none" />

            {/* Badge flotante si existe */}
            {dish.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-neutral-900/85 backdrop-blur-md text-amber-400 border border-neutral-700/60 text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg inline-flex items-center gap-1">
                  {dish.badge}
                </span>
              </div>
            )}

            {/* Botón de cierre en esquina superior sobre la imagen */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-warmCream hover:text-white bg-black/60 hover:bg-black/80 backdrop-blur-md p-2 rounded-full border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Cerrar ventana de personalización"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* Botón de cierre estándar si no hay imagen */
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-warmMuted hover:text-warmCream bg-[#171717] hover:bg-[#252525] p-2 rounded-full border border-charcoalBorder transition-colors cursor-pointer"
            aria-label="Cerrar ventana de personalización"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Cuerpo del modal con descripción, porción, tags y opciones */}
        <div className="p-5 sm:p-6">
          {/* Título, Porción y Precio */}
          <div className="mb-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 id="modal-dish-title" className="text-xl sm:text-2xl font-black text-warmCream leading-tight">
                  {dish.name.replace(/\s*\([^)]*\)$/, '').trim()}
                </h2>
                {(dish.portion || dish.name.match(/\(([^)]+)\)$/)?.[1]) && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-800 border border-neutral-700/70 text-neutral-300">
                    {dish.portion || dish.name.match(/\(([^)]+)\)$/)?.[1]}
                  </span>
                )}
              </div>
              <span className="text-amber-400 font-black text-xl sm:text-2xl whitespace-nowrap">
                ${Number(dish.price || 0).toFixed(2)} MXN
              </span>
            </div>
            
            <p className="text-neutral-300 text-xs sm:text-sm mt-2.5 leading-relaxed">
              {dish.description}
            </p>

            {/* Etiquetas gastronómicas y dietéticas completas reservadas para el modal */}
            {dish.tags && dish.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3 border-t border-neutral-800/60">
                {dish.tags.map((tag) => {
                  const tagMap = {
                    'sin-gluten': { label: 'Sin Gluten', icon: '🌾' },
                    'picante': { label: 'Picante', icon: '🌶️' },
                    'especialidad': { label: 'Especialidad', icon: '⭐' },
                    'para-compartir': { label: 'Para Compartir', icon: '👥' },
                    'vegetariano': { label: 'Vegetariano', icon: '🥗' },
                    'ligero': { label: 'Ligero', icon: '🥗' },
                    'ahumado': { label: 'Ahumado Low & Slow', icon: '🪵' },
                    'top-ventas': { label: 'Top Ventas', icon: '🔥' },
                    'gourmet': { label: 'Gourmet', icon: '✨' },
                    'artesanal': { label: 'Artesanal', icon: '🍻' },
                    'bebida': { label: 'Bebida', icon: '🍺' }
                  };
                  const info = tagMap[tag] || { label: tag, icon: '🏷️' };
                  return (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium"
                    >
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Término de la carne (si aplica) */}
            {dish.requiresCookingPoint && (
              <div className="pt-2 border-t border-charcoalBorder">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-flameOrange" />
                  <h3 className="text-sm font-bold text-warmCream">
                    Elige el término de la carne <span className="text-flameOrange font-semibold">(Requerido):</span>
                  </h3>
                </div>
                <div className="space-y-2">
                  {COOKING_POINTS.map((point) => {
                    const isSelected = selectedCookingPoint === point;
                    return (
                      <label
                        key={point}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'border-flameOrange bg-flameOrange/10 text-warmCream shadow-sm'
                            : 'border-charcoalBorder bg-[#171717] text-warmMuted hover:border-charcoalBorder/80 hover:text-warmCream'
                        }`}
                      >
                        <input
                          type="radio"
                          name="cookingPoint"
                          value={point}
                          checked={isSelected}
                          onChange={() => setSelectedCookingPoint(point)}
                          className="mt-1 h-4 w-4 text-flameOrange accent-flameOrange border-charcoalBorder focus:ring-flameOrange cursor-pointer"
                          required
                        />
                        <span className="text-xs sm:text-sm font-medium leading-relaxed">
                          {point}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sección 2: Guarnición incluida (si aplica) */}
            {dish.hasSideOptions && (
              <div className="pt-2 border-t border-charcoalBorder">
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="w-4 h-4 text-flameOrange" />
                  <h3 className="text-sm font-bold text-warmCream">
                    Elige tu guarnición incluida <span className="text-badgeGold font-semibold">(1 a elegir):</span>
                  </h3>
                </div>
                <div className="space-y-2">
                  {SIDE_OPTIONS.map((side) => {
                    const isSelected = selectedSide === side;
                    return (
                      <label
                        key={side}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'border-flameOrange bg-flameOrange/10 text-warmCream shadow-sm'
                            : 'border-charcoalBorder bg-[#171717] text-warmMuted hover:border-charcoalBorder/80 hover:text-warmCream'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sideOption"
                          value={side}
                          checked={isSelected}
                          onChange={() => setSelectedSide(side)}
                          className="h-4 w-4 text-flameOrange accent-flameOrange border-charcoalBorder focus:ring-flameOrange cursor-pointer"
                          required
                        />
                        <span className="text-xs sm:text-sm font-medium">
                          {side}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sección 3: Notas para la cocina */}
            <div className="pt-2 border-t border-charcoalBorder">
              <label htmlFor="modal-kitchen-notes" className="block text-sm font-bold text-warmCream mb-2">
                Notas para la cocina:
              </label>
              <textarea
                id="modal-kitchen-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Sin cebolla, aderezo aparte, salsa extra picante..."
                rows={3}
                className="w-full rounded-xl bg-[#171717] border border-charcoalBorder p-3 text-xs sm:text-sm text-warmCream placeholder:text-warmMuted/60 focus:outline-none focus:border-flameOrange focus:ring-1 focus:ring-flameOrange resize-none transition-all"
              />
            </div>

            {/* Selector de cantidad */}
            <div className="pt-2 border-t border-charcoalBorder flex items-center justify-between">
              <span className="text-sm font-bold text-warmCream">
                Cantidad:
              </span>
              <div className="flex items-center gap-3 bg-[#171717] border border-charcoalBorder rounded-xl p-1">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-warmCream hover:bg-charcoalCard disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-sm text-warmCream select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-warmCream hover:bg-charcoalCard transition-colors cursor-pointer"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Botón inferior de confirmación */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-flameOrange hover:bg-flameOrangeHover font-bold py-3.5 w-full rounded-xl transition-all text-warmCream text-sm sm:text-base shadow-lg cursor-pointer active:scale-95"
              >
                Confirmar y Agregar a la Orden • ${totalPrice} MXN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
