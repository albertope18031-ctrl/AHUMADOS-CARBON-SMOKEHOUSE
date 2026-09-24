import React from 'react';

export default function Hero({ orderMode = 'mesa' }) {
  // En modalidad "En Mesa", se retira el banner promocional para dar acceso inmediato a la carta
  if (orderMode === 'mesa') {
    return null;
  }

  /* Modo Para Llevar: Banner informativo conciso para pick-up */
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900/90 to-charcoal border-b border-neutral-800/80 py-3.5 sm:py-4 px-4">
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
