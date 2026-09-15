import React from 'react';
import { MapPin, Clock, Phone, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function Footer() {
  const agencyWhatsappMessage = encodeURIComponent(
    "Hola, vi la demo de Ahumados & Carbón y me interesa implementar un menú digital QR para mi restaurante."
  );
  const agencyWhatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber || '526624175122'}?text=${agencyWhatsappMessage}`;

  return (
    <footer className="bg-[#0d0d0d] border-t border-charcoalBorder py-10 px-4 text-center text-warmCream">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Logotipo centrado */}
        <div className="flex flex-col items-center justify-center gap-2">
          <img
            src="/logo-ahumados.png"
            alt="Ahumados & Carbón Smokehouse"
            className="h-14 w-auto object-contain rounded-lg shadow-md"
            onError={(e) => {
              if (e.target.src.indexOf('.png.jpg') === -1) {
                e.target.src = '/logo-ahumados.png.jpg';
              }
            }}
          />
          <h3 className="font-extrabold text-lg sm:text-xl tracking-wider text-warmCream">
            {RESTAURANT_INFO.name}
          </h3>
          <p className="text-xs text-flameOrange font-semibold tracking-widest uppercase">
            {RESTAURANT_INFO.tagline}
          </p>
        </div>

        {/* Datos de ubicación y horarios */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-warmMuted pt-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-flameOrange flex-shrink-0" />
            <span>{RESTAURANT_INFO.address}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-flameOrange flex-shrink-0" />
            <span>{RESTAURANT_INFO.hours}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-flameOrange flex-shrink-0" />
            <a
              href={`tel:${(RESTAURANT_INFO.phoneDisplay || '').replace(/\s+/g, '')}`}
              className="hover:text-warmCream transition-colors underline-offset-2 hover:underline"
            >
              {RESTAURANT_INFO.phoneDisplay || "662 417 5122"}
            </a>
          </div>
        </div>

        {/* SELLO ESTRATÉGICO DE VENTA (Firma de Autoridad) */}
        <div className="bg-[#171717] border border-badgeGold/40 rounded-2xl p-6 max-w-2xl mx-auto shadow-xl space-y-3 mt-6">
          <div className="inline-flex items-center gap-2 text-badgeGold text-xs font-bold uppercase tracking-wider bg-badgeGold/10 px-3 py-1 rounded-full border border-badgeGold/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tecnología Gastronómica de Alta Conversión</span>
          </div>

          <p className="text-xs sm:text-sm text-warmCream font-medium leading-relaxed">
            Menú Digital Interactivo & Sistema de Pedidos Express desarrollado por{' '}
            <strong className="text-badgeGold font-bold">Acceso Digital Premium</strong>.
          </p>

          <div className="pt-2">
            <a
              href={agencyWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs sm:text-sm text-warmMuted hover:text-warmCream transition-colors"
            >
              ¿Quieres un menú digital como este para tu restaurante?{' '}
              <span className="text-flameOrange font-bold underline hover:text-flameOrangeHover ml-1">
                [ Cotiza aquí con nosotros ]
              </span>
            </a>
          </div>
        </div>

        {/* Derechos y copyright */}
        <div className="pt-4 text-[11px] text-warmMuted/60">
          <p>© {new Date().getFullYear()} {RESTAURANT_INFO.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
