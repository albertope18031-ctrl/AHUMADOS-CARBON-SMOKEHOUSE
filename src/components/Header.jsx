import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function Header({
  orderMode: controlledOrderMode,
  setOrderMode: controlledSetOrderMode,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart
}) {
  // Estado local si no se provee por props controladas
  const [internalOrderMode, setInternalOrderMode] = useState('mesa');
  
  const currentMode = controlledOrderMode !== undefined ? controlledOrderMode : internalOrderMode;
  const handleModeChange = (mode) => {
    if (controlledSetOrderMode) {
      controlledSetOrderMode(mode);
    } else {
      setInternalOrderMode(mode);
    }
  };

  const formattedTotal = typeof cartTotal === 'number' ? cartTotal.toFixed(2) : Number(cartTotal || 0).toFixed(2);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-charcoal/95 backdrop-blur-md border-b border-charcoalBorder">
      {/* Barra superior de estado */}
      <div className="bg-[#0d0d0d] py-1 px-3 border-b border-charcoalBorder/50">
        <p className="text-center text-[11px] sm:text-xs text-warmCream/90 font-medium tracking-tight truncate sm:text-clip">
          {RESTAURANT_INFO.status || "🟢 Abierto hoy • Fuego encendido hasta las 11:00 PM"}
        </p>
      </div>

      {/* Fila principal optimizada para móviles y desktop */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Lado izquierdo: Logo & Branding */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 cursor-pointer">
          <img
            src="/logo-ahumados.png"
            alt="Logo Ahumados & Carbón"
            className="h-8 sm:h-10 w-auto object-contain rounded-md"
            onError={(e) => {
              if (e.target.src.indexOf('.png.jpg') === -1) {
                e.target.src = '/logo-ahumados.png.jpg';
              }
            }}
          />
          <div className="leading-tight">
            <span className="font-bold text-warmCream text-xs sm:text-base tracking-wide block">
              AHUMADOS & CARBÓN
            </span>
            <span className="text-[10px] sm:text-xs text-flameOrange tracking-wider font-semibold block">
              SMOKEHOUSE
            </span>
          </div>
        </div>

        {/* Centro: Selector de modo de orden tipo píldora */}
        <div className="bg-[#0f0f0f] p-0.5 sm:p-1 rounded-full border border-charcoalBorder flex items-center">
          <button
            type="button"
            onClick={() => handleModeChange('mesa')}
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
              currentMode === 'mesa'
                ? 'bg-flameOrange text-warmCream shadow-md'
                : 'text-warmMuted hover:text-warmCream'
            }`}
          >
            <span>🍽️</span>
            <span>En Mesa</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('llevar')}
            className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
              currentMode === 'llevar'
                ? 'bg-flameOrange text-warmCream shadow-md'
                : 'text-warmMuted hover:text-warmCream'
            }`}
          >
            <span>🛍️</span>
            <span>Para Llevar</span>
          </button>
        </div>

        {/* Lado derecho: Botón del carrito visible solo en pantallas medianas/grandes */}
        <div className="hidden md:flex flex-shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="bg-flameOrange hover:bg-flameOrangeHover text-warmCream px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            aria-label="Ver orden actual"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Orden ({cartCount}) • ${formattedTotal}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
