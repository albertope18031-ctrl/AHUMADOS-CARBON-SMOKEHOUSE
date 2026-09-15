import React, { useState, useEffect } from 'react';
import { Bell, Clock, X, MessageSquare, Check } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { cleanTableNumber } from '../utils/textUtils';

const REASON_OPTIONS = [
  { id: 'menu_help', label: 'Ayuda / Consulta del menú', icon: '📖' },
  { id: 'supplies', label: 'Servilletas / Cubiertos / Vasos', icon: '🍴' },
  { id: 'cleaning', label: 'Limpieza de mesa', icon: '🧽' },
  { id: 'other', label: 'Otro motivo', icon: '✨' }
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

  // Cerrar modal al presionar la tecla Escape
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
  const sanitizedTable = cleanTableNumber(tableNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCooldownActive) return;

    onConfirmCall({
      tableNumber: sanitizedTable,
      reason: selectedReason,
      customNote: selectedReason === 'Otro motivo' || customNote.trim() ? customNote.trim() : null
    });
  };

  const handleWhatsAppAlert = () => {
    const noteText = customNote.trim() ? ` (${customNote.trim()})` : '';
    const message = `🛎️ *SOLICITUD DE ASISTENCIA - AHUMADOS & CARBÓN SMOKEHOUSE* 🛎️
--------------------------------------------------
📍 *Mesa:* ${sanitizedTable ? `Mesa ${sanitizedTable}` : 'Sin especificar'}
✋ *Motivo:* ${selectedReason}${noteText}
⏰ *Hora:* ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
--------------------------------------------------
Comensal esperando asistencia en sala.`;

    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber || '526624175122'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-waiter-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 text-white shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
        {/* Botón de cierre visible */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 p-2 rounded-full border border-neutral-700 transition-colors cursor-pointer"
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
            <h3 id="call-waiter-title" className="text-lg font-black text-white leading-tight">
              Llamar Mesero
            </h3>
            <span className="text-xs text-amber-400 font-bold tracking-wide">
              {sanitizedTable ? `📍 Mesa ${sanitizedTable}` : '📍 Asistencia en sala'}
            </span>
          </div>
        </div>

        {isCooldownActive ? (
          /* Estado en Cooldown (solicitud enviada en curso) */
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-flameOrange/15 text-flameOrange mx-auto flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">
              Mesero en camino 🛎️
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Un miembro del equipo está acudiendo a tu mesa. Podrás enviar un nuevo aviso en:
            </p>
            <div className="text-xl font-mono font-black text-flameOrange">
              ⏳ {cooldownSeconds}s
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-bold text-white hover:border-flameOrange transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        ) : (
          /* Formulario de Llamado */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                ¿En qué te apoyamos?
              </label>

              <div className="space-y-2">
                {REASON_OPTIONS.map((opt) => {
                  const isSelected = selectedReason === opt.label;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedReason(opt.label)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-flameOrange/15 border-flameOrange text-white shadow-md'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
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
              <label htmlFor="custom-call-note" className="block text-xs font-bold text-neutral-400 mb-1">
                Detalle adicional (opcional):
              </label>
              <input
                id="custom-call-note"
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ej. Servilletas, salsa extra..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-flameOrange transition-colors"
              />
            </div>

            {/* Botón principal de Confirmación */}
            <button
              type="submit"
              className="w-full bg-flameOrange hover:bg-flameOrangeHover active:scale-[0.98] text-white font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-flameOrange/25 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>SOLICITAR MESERO 🛎️</span>
            </button>

            {/* Canal secundario WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppAlert}
              className="w-full text-[11px] text-neutral-400 hover:text-emerald-400 py-1 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>O avisar por WhatsApp</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
