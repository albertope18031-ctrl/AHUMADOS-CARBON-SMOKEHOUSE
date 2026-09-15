import React, { useState, useEffect } from 'react';
import { Bell, Clock, X, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { cleanTableNumber } from '../utils/textUtils';

const REASON_OPTIONS = [
  { id: 'menu_help', label: 'Ayuda / Consulta del menú', icon: '📖' },
  { id: 'supplies', label: 'Servilletas / Cubiertos / Vasos', icon: '🍴' },
  { id: 'cleaning', label: 'Limpieza de mesa', icon: '🧽' },
  { id: 'other', label: 'Otro', icon: '✨' }
];

export default function CallWaiterModal({
  isOpen,
  tableNumber = '',
  onClose,
  onConfirmCall,
  cooldownSeconds = 0
}) {
  const [selectedReason, setSelectedReason] = useState(REASON_OPTIONS[0].label);
  const [customNote, setCustomNote] = useState('');

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

  const isCooldownActive = cooldownSeconds > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCooldownActive) return;

    onConfirmCall({
      tableNumber,
      reason: selectedReason,
      customNote: selectedReason === 'Otro' || customNote.trim() ? customNote.trim() : null
    });
  };

  const handleWhatsAppAlert = () => {
    const noteText = customNote.trim() ? ` (${customNote.trim()})` : '';
    const message = `🛎️ *SOLICITUD DE ASISTENCIA - AHUMADOS & CARBÓN SMOKEHOUSE* 🛎️
--------------------------------------------------
📍 *Mesa:* #${tableNumber || 'Sin especificar'}
✋ *Motivo:* ${selectedReason}${noteText}
⏰ *Hora:* ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
--------------------------------------------------
Comensal esperando asistencia en sala.`;

    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber || '526624175122'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-waiter-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-charcoalCard border border-charcoalBorder rounded-2xl max-w-md w-full p-5 sm:p-6 text-warmCream shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
        {/* Botón de cierre */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-warmMuted hover:text-warmCream bg-[#171717] hover:bg-[#252525] p-2 rounded-full border border-charcoalBorder transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="p-2.5 rounded-xl bg-flameOrange/15 border border-flameOrange/30 text-flameOrange">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 id="call-waiter-title" className="text-lg sm:text-xl font-black text-warmCream leading-tight">
              Llamar Mesero
            </h3>
            <span className="text-xs text-badgeGold font-bold tracking-wide">
              {cleanTableNumber(tableNumber) ? `📍 Asistencia para Mesa ${cleanTableNumber(tableNumber)}` : '📍 Asistencia en sala'}
            </span>
          </div>
        </div>

        {isCooldownActive ? (
          /* Estado en Cooldown */
          <div className="p-4 rounded-xl bg-[#141414] border border-charcoalBorder text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-flameOrange/15 text-flameOrange mx-auto flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-warmCream">
              Solicitud de mesero en curso
            </h4>
            <p className="text-xs text-warmMuted leading-relaxed">
              Un miembro de nuestro equipo está acudiendo a la <strong className="text-warmCream">Mesa {cleanTableNumber(tableNumber)}</strong>. Podrás solicitar asistencia nuevamente en:
            </p>
            <div className="text-xl font-mono font-black text-flameOrange">
              ⏳ {cooldownSeconds} segundos
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full py-2.5 rounded-xl bg-charcoalCard border border-charcoalBorder text-xs font-bold text-warmCream hover:border-flameOrange transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        ) : (
          /* Formulario de Llamado */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-warmMuted uppercase tracking-wider mb-2.5">
                ¿En qué podemos apoyarte hoy?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {REASON_OPTIONS.map((opt) => {
                  const isSelected = selectedReason === opt.label;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedReason(opt.label)}
                      className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none min-h-[44px] ${
                        isSelected
                          ? 'bg-flameOrange/15 border-flameOrange text-warmCream shadow-md'
                          : 'bg-[#171717] border-charcoalBorder text-warmMuted hover:border-charcoalBorder/80 hover:text-warmCream'
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{opt.icon}</span>
                      <span className="flex-1 leading-snug">{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-flameOrange flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campo opcional de detalle */}
            <div>
              <label htmlFor="custom-call-note" className="block text-xs font-bold text-warmMuted mb-1.5">
                Detalle adicional (opcional):
              </label>
              <input
                id="custom-call-note"
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ej. Vasos con hielo extra, cubiertos adicionales..."
                className="w-full bg-[#171717] border border-charcoalBorder rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-warmCream placeholder:text-warmMuted/60 focus:outline-none focus:border-flameOrange transition-colors min-h-[44px]"
              />
            </div>

            {/* Botón principal de Confirmación */}
            <button
              type="submit"
              className="w-full bg-flameOrange hover:bg-flameOrangeHover active:scale-[0.98] text-warmCream font-black py-3.5 px-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-flameOrange/20 transition-all cursor-pointer min-h-[48px]"
            >
              <Bell className="w-4 h-4" />
              <span>SOLICITAR ASISTENCIA AHORA 🛎️</span>
            </button>

            {/* Canal secundario WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppAlert}
              className="w-full text-xs text-warmMuted hover:text-emerald-400 py-1 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>O enviar aviso urgente por WhatsApp</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
