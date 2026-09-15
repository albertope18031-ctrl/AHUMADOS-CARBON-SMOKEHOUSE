import React, { useEffect } from 'react';
import { FileText, X, MessageSquare, Mail, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function InvoiceModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappInvoiceMessage = encodeURIComponent(
    "Hola, deseo solicitar mi Factura CFDI de mi consumo en Ahumados & Carbón Smokehouse. Adjunto mi foto de ticket y datos fiscales (RFC, Razón Social, C.P., Régimen y Uso de CFDI)."
  );
  const whatsappInvoiceUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber || '526624175122'}?text=${whatsappInvoiceMessage}`;
  const mailtoUrl = `mailto:${RESTAURANT_INFO.billingEmail}?subject=Solicitud%20de%20Factura%20CFDI%20-%20Ahumados%20%26%20Carb%C3%B3n&body=${encodeURIComponent(
    "Estimado equipo de facturación de Ahumados & Carbón,\n\nSolicito la emisión de mi comprobante fiscal digital (CFDI) correspondiente a mi visita.\n\nDatos:\n- Folio de Ticket / Comanda:\n- RFC:\n- Nombre o Razón Social:\n- Código Postal Fiscal:\n- Régimen Fiscal:\n- Uso de CFDI:\n- Correo para envío:\n\n(Adjunto fotografía de mi ticket de compra).\n\nMuchas gracias."
  )}`;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-charcoalCard border border-charcoalBorder rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 text-warmCream shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
        {/* Botón de cierre */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-warmMuted hover:text-warmCream bg-[#171717] hover:bg-[#252525] p-2 rounded-full border border-charcoalBorder transition-colors cursor-pointer"
          aria-label="Cerrar modal de facturación"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-flameOrange/15 text-flameOrange border border-flameOrange/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="invoice-modal-title" className="text-lg sm:text-xl font-black text-warmCream">
                Solicitud de Factura (CFDI 4.0)
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-badgeGold/15 border border-badgeGold/30 text-badgeGold px-2 py-0.5 rounded-md">
                SAT MX
              </span>
            </div>
            <p className="text-xs text-warmMuted mt-0.5">
              Generamos tu Comprobante Fiscal Digital por Internet sin complicaciones.
            </p>
          </div>
        </div>

        {/* Pasos para facturar */}
        <div className="space-y-3 my-5">
          <div className="bg-[#141414] border border-charcoalBorder rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-warmCream">
              <span className="w-5 h-5 rounded-full bg-flameOrange text-warmCream flex items-center justify-center text-[11px] font-black">
                1
              </span>
              <span>Conserva tu Comanda o Ticket de Consumo</span>
            </div>
            <p className="text-xs text-warmMuted leading-relaxed pl-7">
              Requerirás el <strong className="text-warmCream">Folio de Ticket</strong> o el número de comanda digital generado al cerrar tu cuenta.
            </p>
          </div>

          <div className="bg-[#141414] border border-charcoalBorder rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-warmCream">
              <span className="w-5 h-5 rounded-full bg-flameOrange text-warmCream flex items-center justify-center text-[11px] font-black">
                2
              </span>
              <span>Datos Fiscales Requeridos (CFDI 4.0)</span>
            </div>
            <div className="text-xs text-warmMuted pl-7 space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-flameOrange flex-shrink-0" />
                <span>RFC con homoclave y Código Postal fiscal del domicilio.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-flameOrange flex-shrink-0" />
                <span>Razón Social / Nombre completo tal como figura en tu Constancia del SAT.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-flameOrange flex-shrink-0" />
                <span>Régimen Fiscal y Uso de CFDI (por ejemplo: Gastos en general).</span>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-charcoalBorder rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-warmCream">
              <span className="w-5 h-5 rounded-full bg-flameOrange text-warmCream flex items-center justify-center text-[11px] font-black">
                3
              </span>
              <span>Métodos Rápidos para Solicitarla</span>
            </div>
            <p className="text-xs text-warmMuted leading-relaxed pl-7">
              Puedes solicitarla directamente al mesero al pedir la cuenta en sala, o enviando la foto de tu ticket por cualquiera de nuestras vías de facturación:
            </p>

            <div className="grid sm:grid-cols-2 gap-2 pl-7 pt-1">
              <a
                href={whatsappInvoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/40 text-green-400 p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Vía WhatsApp Directo</span>
              </a>

              <a
                href={mailtoUrl}
                className="bg-charcoal border border-charcoalBorder hover:border-warmCream/40 text-warmCream p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors text-center"
              >
                <Mail className="w-4 h-4 text-badgeGold" />
                <span>Por Correo Electrónico</span>
              </a>
            </div>
          </div>
        </div>

        {/* Políticas fiscales y plazos */}
        <div className="p-3.5 rounded-2xl bg-badgeGold/10 border border-badgeGold/30 flex items-start gap-2.5 text-xs text-warmCream/90 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-badgeGold flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-badgeGold font-bold">Importante: </strong>
            Conforme a disposiciones fiscales del SAT, la factura debe solicitarse dentro del mes en el que se realizó el consumo. Recibirás tus archivos PDF y XML en un lapso máximo de 24 a 48 horas hábiles.
          </p>
        </div>

        {/* Botón de cerrar */}
        <div className="mt-6 pt-4 border-t border-charcoalBorder flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-charcoal hover:bg-[#222222] border border-charcoalBorder text-warmCream text-xs font-bold transition-colors cursor-pointer"
          >
            Entendido, volver al menú
          </button>
        </div>
      </div>
    </div>
  );
}
