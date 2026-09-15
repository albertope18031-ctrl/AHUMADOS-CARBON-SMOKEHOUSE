import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal border-b border-charcoalBorder/60 pt-28 pb-6 sm:pt-32 sm:pb-8 px-4">
      {/* Gradiente radial suave en tono carbón quemado de fondo */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(34,34,34,0.9)_0%,_rgba(23,23,23,1)_70%)]"
        aria-hidden="true" 
      />

      <div className="relative max-w-4xl mx-auto flex flex-col items-start text-left">
        {/* Kicker superior */}
        <p className="text-flameOrange font-bold text-xs tracking-widest uppercase mb-2">
          {RESTAURANT_INFO.tagline ? RESTAURANT_INFO.tagline.toUpperCase() : "HUMO, BRASA & CERVEZA ARTESANAL"}
        </p>

        {/* H1 Principal */}
        <h1 className="text-warmCream font-black text-2xl sm:text-4xl leading-tight">
          El verdadero sabor de la leña, el carbón y el fuego lento.
        </h1>

        {/* Subtítulo */}
        <p className="text-warmMuted text-sm mt-2 max-w-xl">
          Explora nuestra carta, elige tus platillos favoritos y envía tu orden directa a cocina o recógela sin pagar comisiones extras de aplicaciones.
        </p>

        {/* Badge de frescura */}
        <div className="border border-charcoalBorder bg-charcoalCard/80 px-3 py-2 mt-4 inline-flex items-center gap-2 text-xs text-warmCream rounded-xl shadow-inner">
          <span>{RESTAURANT_INFO.smokeBadge || "⏳ Ahumado artesanalmente por hasta 12 horas con leña de encino seleccionada."}</span>
        </div>
      </div>
    </section>
  );
}
