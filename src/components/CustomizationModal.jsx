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

  // Inicializar o restablecer estados cada vez que se selecciona un platillo
  useEffect(() => {
    if (dish) {
      setSelectedCookingPoint(COOKING_POINTS[0] || '');
      setSelectedSide(SIDE_OPTIONS[0] || '');
      setNotes('');
      setQuantity(1);
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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dish-title"
    >
      <div className="bg-charcoalCard border border-charcoalBorder rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-warmCream shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Botón de cierre en esquina superior */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-warmMuted hover:text-warmCream bg-[#171717] hover:bg-[#252525] p-2 rounded-full border border-charcoalBorder transition-colors cursor-pointer"
          aria-label="Cerrar ventana de personalización"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado: Nombre y Precio */}
        <div className="pr-10 mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            {dish.badge && (
              <span className="bg-flameOrange/15 text-flameOrange border border-flameOrange/30 text-[11px] font-bold px-2 py-0.5 rounded-full inline-block">
                {dish.badge}
              </span>
            )}
          </div>
          <h2 id="modal-dish-title" className="text-xl sm:text-2xl font-black text-warmCream leading-tight">
            {dish.name}
          </h2>
          <p className="text-flameOrange font-extrabold text-lg mt-1">
            ${Number(dish.price || 0).toFixed(2)} MXN
          </p>
          <p className="text-warmMuted text-xs sm:text-sm mt-2 leading-relaxed">
            {dish.description}
          </p>
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
              className="bg-flameOrange hover:bg-flameOrangeHover font-bold py-3 w-full rounded-xl transition-all text-warmCream text-sm sm:text-base shadow-lg cursor-pointer active:scale-95"
            >
              Confirmar y Agregar a la Orden • ${totalPrice} MXN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
