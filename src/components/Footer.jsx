import React from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  PhoneCall, 
  Navigation, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Banknote,
  CheckCircle2
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function Footer({ onOpenInvoiceModal }) {
  const agencyWhatsappMessage = encodeURIComponent(
    "Hola, vi la demo de Ahumados & Carbón y me interesa implementar un menú digital QR para mi restaurante."
  );
  const agencyWhatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber || '526624175122'}?text=${agencyWhatsappMessage}`;

  return (
    <footer className="bg-[#0b0b0b] border-t border-charcoalBorder pt-12 pb-14 px-4 text-warmCream">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 1. Logotipo y Presentación de la Marca */}
        <div className="flex flex-col items-center justify-center text-center gap-2.5">
          <img
            src="/logo-ahumados.png"
            alt="Ahumados & Carbón Smokehouse"
            className="h-16 w-auto object-contain rounded-xl shadow-lg border border-charcoalBorder/60"
            onError={(e) => {
              if (e.target.src.indexOf('.png.jpg') === -1) {
                e.target.src = '/logo-ahumados.png.jpg';
              }
            }}
          />
          <h3 className="font-black text-xl sm:text-2xl tracking-wider text-warmCream mt-1">
            {RESTAURANT_INFO.name}
          </h3>
          <p className="text-xs sm:text-sm text-flameOrange font-bold tracking-widest uppercase">
            {RESTAURANT_INFO.tagline}
          </p>
          <p className="text-xs text-warmMuted max-w-lg leading-relaxed">
            Pasión por el humo lento con leña de encino y mezquite. Cocina a fuego vivo, cortes calidad Prime y cerveza artesanal seleccionada.
          </p>
        </div>

        {/* 2. Cuadrícula de Enlaces Interactivos (Ubicación, Contacto y Horarios) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tarjeta A: Ubicación Interactiva y GPS */}
          <div className="bg-charcoalCard/70 border border-charcoalBorder rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-flameOrange mb-2">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <h4 className="font-bold text-sm text-warmCream uppercase tracking-wide">
                  Ubicación en Sala
                </h4>
              </div>
              <p className="text-xs text-warmCream/90 font-medium">
                {RESTAURANT_INFO.address}
              </p>
              <p className="text-[11px] text-warmMuted mt-1">
                Zona Poniente • Estacionamiento vigilado y rampa de acceso.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={RESTAURANT_INFO.googleMapsUrl || "https://maps.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#171717] hover:bg-[#222222] border border-charcoalBorder hover:border-flameOrange/60 text-warmCream px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <Navigation className="w-3.5 h-3.5 text-flameOrange" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-warmMuted" />
              </a>

              <a
                href={RESTAURANT_INFO.wazeUrl || "https://waze.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#171717] hover:bg-[#222222] border border-charcoalBorder hover:border-blue-400/60 text-warmCream px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <span className="text-xs">🚗</span>
                <span>Waze</span>
                <ExternalLink className="w-3 h-3 text-warmMuted" />
              </a>
            </div>
          </div>

          {/* Tarjeta B: Contacto Directo y Reservaciones */}
          <div className="bg-charcoalCard/70 border border-charcoalBorder rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-flameOrange mb-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <h4 className="font-bold text-sm text-warmCream uppercase tracking-wide">
                  Atención & Llamadas
                </h4>
              </div>
              <p className="text-xs text-warmMuted">
                Para eventos privados, reservaciones de mesas grandes o pedidos para llevar:
              </p>
              <div className="mt-2 space-y-1">
                <a
                  href={`tel:${RESTAURANT_INFO.phoneRaw || '+526624175122'}`}
                  className="text-base font-black text-warmCream hover:text-flameOrange transition-colors flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-flameOrange animate-pulse" />
                  <span>{RESTAURANT_INFO.phoneDisplay || "662 417 5122"}</span>
                </a>
                <span className="text-[10px] text-green-400 font-semibold block">
                  ● Línea activa para llamadas directas
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber || '526624175122'}?text=${encodeURIComponent('Hola Ahumados & Carbón, me gustaría consultar información de sus mesas.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#171717] hover:bg-green-950/40 border border-charcoalBorder hover:border-green-500/50 text-warmCream px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all text-center"
              >
                <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                <span>WhatsApp de Contacto</span>
              </a>
            </div>
          </div>

          {/* Tarjeta C: Horarios Semanales Detallados */}
          <div className="bg-charcoalCard/70 border border-charcoalBorder rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-flameOrange mb-2">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <h4 className="font-bold text-sm text-warmCream uppercase tracking-wide">
                  Horarios Semanales
                </h4>
              </div>

              <div className="space-y-1.5 text-xs">
                {RESTAURANT_INFO.scheduleWeekly ? (
                  RESTAURANT_INFO.scheduleWeekly.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1 border-b border-charcoalBorder/50 last:border-b-0 text-[11px]"
                    >
                      <span className={item.isOpen ? 'font-medium text-warmCream' : 'text-warmMuted/60'}>
                        {item.days}
                      </span>
                      <span className={item.isOpen ? 'font-bold text-warmCream' : 'text-warmMuted/60 italic'}>
                        {item.hours}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-warmMuted">{RESTAURANT_INFO.hours}</p>
                )}
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[10px] text-warmMuted bg-[#121212] px-2 py-1 rounded-lg border border-charcoalBorder block text-center">
                {RESTAURANT_INFO.status}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Redes Sociales Oficiales */}
        <div className="border border-charcoalBorder bg-charcoalCard/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-warmCream">
              Síguenos en nuestras brasas digitales
            </h4>
            <p className="text-xs text-warmMuted mt-0.5">
              Descubre cortes especiales del día, videos de ahumado y promociones exclusivas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a
              href={RESTAURANT_INFO.socialLinks?.instagram || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Oficial"
              className="p-3 rounded-xl bg-[#171717] hover:bg-gradient-to-tr hover:from-amber-600 hover:to-pink-600 border border-charcoalBorder hover:border-transparent text-warmCream transition-all duration-300 transform hover:-translate-y-1 shadow-md group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={RESTAURANT_INFO.socialLinks?.facebook || "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Oficial"
              className="p-3 rounded-xl bg-[#171717] hover:bg-[#1877F2] border border-charcoalBorder hover:border-transparent text-warmCream transition-all duration-300 transform hover:-translate-y-1 shadow-md group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href={RESTAURANT_INFO.socialLinks?.tiktok || "https://tiktok.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Oficial"
              className="p-3 rounded-xl bg-[#171717] hover:bg-[#000000] hover:border-pink-500 border border-charcoalBorder text-warmCream transition-all duration-300 transform hover:-translate-y-1 shadow-md group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.71a8.18 8.18 0 0 0 4.9 1.62V6.88a4.85 4.85 0 0 1-1-.19z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 4. Transparencia, Políticas de Cobro y Facturación Electrónica */}
        <div className="bg-[#121212] border border-charcoalBorder rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-charcoalBorder/80">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-warmCream flex items-center gap-2 justify-center sm:justify-start">
                <ShieldCheck className="w-4 h-4 text-flameOrange" />
                Compromiso de Transparencia & Consumo Claro
              </h4>
              <p className="text-xs text-warmMuted mt-0.5">
                Cuentas claras y respeto total a las disposiciones oficiales para tu tranquilidad.
              </p>
            </div>

            {onOpenInvoiceModal && (
              <button
                type="button"
                onClick={onOpenInvoiceModal}
                className="bg-charcoalCard hover:bg-[#252525] border border-badgeGold/40 text-badgeGold text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Solicitud de Factura (CFDI 4.0)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-warmMuted">
            <div className="bg-[#171717] p-3 rounded-xl border border-charcoalBorder/60">
              <span className="font-bold text-warmCream block mb-1 text-[11px] text-green-400">
                ✓ Precios Netos con IVA
              </span>
              <p className="text-[11px] leading-relaxed">
                Todos los precios de nuestra carta incluyen el Impuesto al Valor Agregado en moneda nacional (MXN).
              </p>
            </div>

            <div className="bg-[#171717] p-3 rounded-xl border border-charcoalBorder/60">
              <span className="font-bold text-warmCream block mb-1 text-[11px] text-badgeGold">
                ✓ Propina 100% Voluntaria
              </span>
              <p className="text-[11px] leading-relaxed">
                La gratificación por el servicio es libre y jamás obligatoria, conforme a la ley del consumidor.
              </p>
            </div>

            <div className="bg-[#171717] p-3 rounded-xl border border-charcoalBorder/60">
              <span className="font-bold text-warmCream block mb-1 text-[11px] text-flameOrange">
                ✓ Sin Comisiones por Tarjeta
              </span>
              <p className="text-[11px] leading-relaxed">
                Aceptamos tarjetas de débito, crédito (Visa, Mastercard, AMEX) y efectivo sin sobrecargos.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Sello Estratégico de Autoridad (Firma de Acceso Digital Premium) */}
        <div className="bg-[#171717] border border-badgeGold/40 rounded-2xl p-6 max-w-2xl mx-auto shadow-xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 text-badgeGold text-xs font-bold uppercase tracking-wider bg-badgeGold/10 px-3.5 py-1 rounded-full border border-badgeGold/20">
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
              ¿Quieres un menú digital interactivo como este para tu restaurante?{' '}
              <span className="text-flameOrange font-bold underline hover:text-flameOrangeHover ml-1">
                [ Cotiza aquí con nosotros ]
              </span>
            </a>
          </div>
        </div>

        {/* 6. Derechos y Copyright */}
        <div className="pt-4 text-center text-[11px] text-warmMuted/60">
          <p>© {new Date().getFullYear()} {RESTAURANT_INFO.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
