import React, { useEffect } from 'react';
import { Flame, Clock, MessageSquare, ArrowLeft, Utensils, X } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { cleanTableNumber } from '../utils/textUtils';

export default function OrderSuccessModal({
  isOpen,
  order,
  onClose,
  onNewRound
}) {
  // Manejo de la tecla Escape para cerrar el modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const handleSendWhatsAppCopy = () => {
    let itemsText = '';
    order.items.forEach((item) => {
      itemsText += `${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
      if (item.selectedCookingPoint) {
        itemsText += `   • Término: ${item.selectedCookingPoint}\n`;
      }
      if (item.selectedSide) {
        itemsText += `   • Guarnición: ${item.selectedSide}\n`;
      }
      if (item.notes && item.notes.trim()) {
        itemsText += `   • Notas: ${item.notes.trim()}\n`;
      }
    });

    const message = `🔥 *TICKET DE COMANDA - AHUMADOS & CARBÓN SMOKEHOUSE* 🔥
Folio: ${order.folio}
--------------------------------------------------
📍 *Mesa:* Mesa ${cleanTableNumber(order.tableNumber)}
⏰ *Hora:* ${order.timestamp}
⏳ *Tiempo estimado:* ${order.estimatedTime || '15 - 25 min'}

📋 *DETALLE DE LA ORDEN:*
${itemsText.trimEnd()}

💰 *TOTAL:* $${Number(order.total || 0).toFixed(2)} MXN
--------------------------------------------------
Comanda registrada en mesa con éxito. Guarde este mensaje como comprobante personal.`;

    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber || '526624175122'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className="bg-charcoalCard border border-charcoalBorder rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 text-warmCream shadow-2xl relative my-auto">
        {/* Botón de cierre visible en la esquina superior derecha */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer z-20 shadow-md active:scale-90"
          aria-label="Cerrar comanda y regresar al sitio web"
          title="Cerrar y volver al sitio web"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge superior de estado en cocina */}
        <div className="text-center mb-4 pr-6 sm:pr-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide mb-3 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>🟢 Comanda Recibida en Cocina</span>
          </div>

          <div className="w-16 h-16 rounded-full bg-flameOrange/15 border border-flameOrange/30 text-flameOrange mx-auto flex items-center justify-center mb-3 shadow-lg shadow-flameOrange/10">
            <Flame className="w-9 h-9 animate-bounce" />
          </div>

          <h2 id="success-modal-title" className="text-2xl font-black text-warmCream tracking-tight">
            ¡Fuego en Marcha!
          </h2>
          <p className="text-xs sm:text-sm text-warmMuted mt-1 max-w-sm mx-auto leading-relaxed">
            Tu orden ha sido enviada a cocina. El equipo comenzará la preparación de inmediato.
          </p>
        </div>

        {/* Tarjeta de Folio y Tiempo Estimado */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#141414] border border-charcoalBorder rounded-xl p-3 text-center">
            <span className="text-[11px] text-warmMuted uppercase font-bold tracking-wider block">
              Folio de Orden
            </span>
            <span className="text-xl sm:text-2xl font-black text-badgeGold font-mono">
              {order.folio}
            </span>
          </div>

          <div className="bg-[#141414] border border-charcoalBorder rounded-xl p-3 text-center">
            <span className="text-[11px] text-warmMuted uppercase font-bold tracking-wider block">
              Ubicación
            </span>
            <span className="text-lg sm:text-xl font-black text-warmCream flex items-center justify-center gap-1">
              📍 Mesa {cleanTableNumber(order.tableNumber)}
            </span>
          </div>
        </div>

        {/* Indicador de tiempo estimado */}
        <div className="bg-flameOrange/10 border border-flameOrange/25 rounded-xl p-3 mb-5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-flameOrange flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-warmCream block">
              Tiempo estimado de entrega: {order.estimatedTime || '15 - 25 min'}
            </span>
            <span className="text-warmMuted">
              Orden registrada a las {order.timestamp}
            </span>
          </div>
        </div>

        {/* Ticket digital desglosado */}
        <div className="bg-[#121212] border border-charcoalBorder/80 rounded-xl p-4 mb-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-charcoalBorder/50 text-xs font-bold text-warmMuted uppercase tracking-wider">
            <span>Resumen del Pedido</span>
            <span>Mesa #{order.tableNumber}</span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="pb-2.5 border-b border-charcoalBorder/30 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-warmCream text-sm">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-bold text-flameOrange text-sm whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Opciones personalizadas */}
                {(item.selectedCookingPoint || item.selectedSide || item.notes) && (
                  <div className="mt-1 pl-2 border-l-2 border-flameOrange/40 text-[11px] text-warmMuted space-y-0.5">
                    {item.selectedCookingPoint && (
                      <p>🔥 Término: <span className="text-warmCream font-medium">{item.selectedCookingPoint}</span></p>
                    )}
                    {item.selectedSide && (
                      <p>🍟 Guarnición: <span className="text-warmCream font-medium">{item.selectedSide}</span></p>
                    )}
                    {item.notes && (
                      <p>📝 Notas: <span className="text-warmCream/80 italic">{item.notes}</span></p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totales del ticket */}
          <div className="pt-2 border-t border-charcoalBorder/60 space-y-1 text-xs text-warmMuted">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${Number(order.subtotal || order.total).toFixed(2)} MXN</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>Servicio a mesa</span>
              <span>$0.00 MXN</span>
            </div>
            <div className="flex justify-between text-base font-black text-warmCream pt-1.5 border-t border-charcoalBorder/40">
              <span>TOTAL</span>
              <span className="text-flameOrange">${Number(order.total).toFixed(2)} MXN</span>
            </div>
          </div>
        </div>

        {/* Botones de acción y retorno al sitio web */}
        <div className="space-y-2.5">
          {/* Botón principal: Pedir algo más para la Mesa X */}
          <button
            type="button"
            onClick={() => {
              if (onNewRound) {
                onNewRound();
              } else {
                onClose();
              }
            }}
            className="w-full bg-flameOrange hover:bg-flameOrangeHover active:scale-[0.98] text-warmCream font-extrabold py-3.5 px-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-flameOrange/20"
          >
            <Utensils className="w-4 h-4" />
            <span>Pedir algo más para la Mesa {cleanTableNumber(order.tableNumber)}</span>
          </button>

          {/* Botón explícito: Volver al Menú / Regresar al Sitio Web */}
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 active:scale-[0.98] text-warmCream font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-flameOrange" />
            <span>Volver al Menú / Regresar al Sitio Web</span>
          </button>

          {/* Botón secundario: Enviar copia a WhatsApp (Opcional) */}
          <button
            type="button"
            onClick={handleSendWhatsAppCopy}
            className="w-full bg-[#141414] hover:bg-[#1f1f1f] border border-charcoalBorder text-warmCream/80 hover:text-warmCream font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>📲 Enviar copia de mi ticket a WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
