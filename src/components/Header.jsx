import React, { useState } from 'react';
import { ShoppingBag, Receipt } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function Header({
  orderMode: controlledOrderMode,
  setOrderMode: controlledSetOrderMode,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
  tableNumber = '',
  isTableLocked = false,
  activeOrder = null,
  onOpenActiveTicket
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

  const formattedTotal =
    typeof cartTotal === 'number'
      ? cartTotal.toFixed(2)
      : Number(cartTotal || 0).toFixed(2);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-charcoal/95 backdrop-blur-md border-b border-charcoalBorder">
      {/* Barra superior delgada de estado */}
      <div className="bg-[#0d0d0d] py-1 px-3 border-b border-charcoalBorder/50 flex items-center justify-between max-w-7xl mx-auto">
        <p className="text-[11px] sm:text-xs text-warmCream/90 font-medium tracking-tight truncate sm:text-clip mx-auto sm:mx-0">
          {RESTAURANT_INFO.status || "🟢 Abierto hoy • Fuego encendido hasta las 11:00 PM"}
        </p>

        {/* Badge visible de Mesa en barra superior (Desktop) */}
        {tableNumber && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-flameOrange/20 border border-flameOrange/40 text-flameOrange text-[11px] font-extrabold tracking-wide">
              📍 Mesa #{tableNumber} {isTableLocked && '🔒'}
            </span>
            {activeOrder && (
              <button
                type="button"
                onClick={onOpenActiveTicket}
                className="text-[11px] text-badgeGold hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Receipt className="w-3 h-3" />
                <span>Ticket {activeOrder.folio}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* DISEÑO EN ESCRITORIO (md:flex o superior) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 h-16 items-center justify-between gap-4">
        {/* Lado izquierdo: Logo & Branding & Badge de Mesa */}
        <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer">
          <img
            src="/logo-ahumados.png"
            alt="Logo Ahumados & Carbón"
            className="h-10 w-auto object-contain rounded-md"
            onError={(e) => {
              if (e.target.src.indexOf('.png.jpg') === -1) {
                e.target.src = '/logo-ahumados.png.jpg';
              }
            }}
          />
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-bold text-warmCream text-base tracking-wide block">
                AHUMADOS & CARBÓN
              </span>
              {tableNumber && (
                <span className="px-2 py-0.5 rounded-md bg-flameOrange/15 border border-flameOrange/30 text-flameOrange text-xs font-bold">
                  📍 Mesa #{tableNumber}
                </span>
              )}
            </div>
            <span className="text-xs text-flameOrange tracking-wider font-semibold block">
              SMOKEHOUSE
            </span>
          </div>
        </div>

        {/* Centro: Selector de modo [En Mesa / Para Llevar] */}
        <div className="bg-[#0f0f0f] p-1 rounded-full border border-charcoalBorder flex items-center">
          <button
            type="button"
            onClick={() => handleModeChange('mesa')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              currentMode === 'llevar'
                ? 'bg-flameOrange text-warmCream shadow-md'
                : 'text-warmMuted hover:text-warmCream'
            }`}
          >
            <span>🛍️</span>
            <span>Para Llevar</span>
          </button>
        </div>

        {/* Lado derecho: Botón ancho Ver Orden */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {activeOrder && (
            <button
              type="button"
              onClick={onOpenActiveTicket}
              className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-badgeGold/40 text-badgeGold hover:bg-[#222222] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Ver Comanda</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            className="bg-flameOrange hover:bg-flameOrangeHover text-warmCream px-3.5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            aria-label="Ver orden actual"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Orden ({cartCount}) • ${formattedTotal}</span>
          </button>
        </div>
      </div>

      {/* DISEÑO EN PANTALLAS MÓVILES (< md) */}
      <div className="md:hidden">
        {/* Fila superior compacta */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-charcoalBorder/40">
          {/* Lado izquierdo: Logo, nombre compacto y badge de mesa */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="/logo-ahumados.png"
              alt="Logo Ahumados & Carbón"
              className="h-8 w-auto object-contain rounded-md"
              onError={(e) => {
                if (e.target.src.indexOf('.png.jpg') === -1) {
                  e.target.src = '/logo-ahumados.png.jpg';
                }
              }}
            />
            <div className="leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-warmCream text-sm tracking-tight block">
                  AHUMADOS & CARBÓN
                </span>
                {tableNumber && (
                  <span className="px-1.5 py-0.5 rounded bg-flameOrange/20 border border-flameOrange/40 text-flameOrange text-[10px] font-black">
                    📍 #{tableNumber}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-flameOrange tracking-wider font-semibold block mt-0.5">
                SMOKEHOUSE
              </span>
            </div>
          </div>

          {/* Lado derecho: Acceso a Comanda activa + Botón circular del carrito */}
          <div className="flex items-center gap-2">
            {activeOrder && (
              <button
                type="button"
                onClick={onOpenActiveTicket}
                className="p-2 rounded-full bg-[#181818] border border-badgeGold/40 text-badgeGold shadow-sm flex items-center justify-center cursor-pointer active:scale-90"
                aria-label="Ver comanda activa"
                title="Ver comanda en preparación"
              >
                <Receipt className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-charcoalCard border border-charcoalBorder text-warmCream hover:border-flameOrange transition-all active:scale-90 cursor-pointer shadow-md flex items-center justify-center"
              aria-label={`Ver orden con ${cartCount} productos`}
            >
              <ShoppingBag className="w-5 h-5 text-warmCream" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-flameOrange text-warmCream text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-75">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Fila secundaria móvil: Selector cómodo para el pulgar con badge de mesa */}
        <div className="px-3 py-1.5 flex items-center justify-center gap-2 bg-[#111111]">
          <div className="w-full max-w-xs bg-[#0f0f0f] p-0.5 rounded-xl border border-charcoalBorder flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => handleModeChange('mesa')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                currentMode === 'mesa'
                  ? 'bg-flameOrange text-warmCream shadow-md'
                  : 'text-warmMuted hover:text-warmCream'
              }`}
            >
              <span>🍽️</span>
              <span>En Mesa {tableNumber ? `(#${tableNumber})` : ''}</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('llevar')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                currentMode === 'llevar'
                  ? 'bg-flameOrange text-warmCream shadow-md'
                  : 'text-warmMuted hover:text-warmCream'
              }`}
            >
              <span>🛍️</span>
              <span>Para Llevar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
