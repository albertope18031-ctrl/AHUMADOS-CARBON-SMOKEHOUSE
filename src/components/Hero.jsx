import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function Hero({ orderMode = 'mesa' }) {
  const isMesa = orderMode === 'mesa';

  if (isMesa) {
    /* 1. Modo En Mesa: Banner ultra-compacto adaptativo con micro-badges */
    return (
      <section className="bg-neutral-950/80 border-b border-neutral-800/80 pt-[114px] md:pt-[90px] pb-2 sm:pb-2.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
          {/* Línea principal compacta */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-warmCream/95">
            <span className="text-flameOrange text-base leading-none">🔥</span>
            <span>Humo & Brasa con Leña de Encino</span>
            <span className="text-neutral-600 hidden xs:inline">•</span>
            <span className="text-amber-400 hidden xs:inline font-bold">Especialidades al Carbón</span>
          </div>

          {/* Micro-badges horizontales en una sola fila */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[10.5px] sm:text-xs text-warmCream/80 font-medium">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 flex-shrink-0">
              <span>🪵</span>
              <span>Leña de Encino</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 flex-shrink-0">
              <span>⏱️</span>
              <span>12h Low & Slow</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 flex-shrink-0">
              <span>🥩</span>
              <span>Calidad Prime</span>
            </span>
          </div>
        </div>
      </section>
    );
  }

  /* 2. Modo Para Llevar: Hero informativo optimizado en altura vertical */
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900/90 to-charcoal border-b border-neutral-800/80 pt-[118px] md:pt-[96px] pb-4 sm:pb-5 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-start text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-flameOrange/15 border border-flameOrange/30 text-flameOrange text-[11px] font-bold uppercase tracking-wider mb-2">
          <span>🛍️ Pedido Para Llevar</span>
          <span>•</span>
          <span>Pick-up Express</span>
        </div>
        <h1 className="text-warmCream font-black text-xl sm:text-2xl leading-tight">
          Ahumados artesanales listos para recoger
        </h1>
        <p className="text-warmMuted text-xs sm:text-sm mt-1 max-w-lg leading-relaxed">
          Ordena directo sin comisiones de apps. Empacado con sello de calor para conservar toda la jugosidad en casa.
        </p>
        <div className="flex items-center gap-2 mt-2.5 text-[11px] text-warmCream/80">
          <span className="px-2.5 py-0.5 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center gap-1 font-medium">
            ⏱️ Listo en 20-30 min
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center gap-1 font-medium">
            💳 Pago en caja o transferencia
          </span>
        </div>
      </div>
    </section>
  );
}
