import React, { useState, useEffect } from 'react';
import { Receipt, CreditCard, Banknote, FileText, Check, X, MessageSquare, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { cleanTableNumber } from '../utils/textUtils';

export default function RequestBillModal({
  isOpen,
  tableNumber = '',
  activeOrder = null,
  cartTotal = 0,
  onClose,
  onConfirmBill
}) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cash'
  const [cashDenomination, setCashDenomination] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15); // 0, 10, 15, 20, 'custom'
  const [customTip, setCustomTip] = useState('');
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [rfc, setRfc] = useState('');
  const [email, setEmail] = useState('');

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

  // Monto base de consumo (desde orden activa o total actual)
  const baseTotal = Number(activeOrder?.total || cartTotal || 0);

  // Cálculo de propina
  let calculatedTip = 0;
  if (tipPercentage === 'custom') {
    calculatedTip = Number(customTip) || 0;
  } else {
    calculatedTip = (baseTotal * Number(tipPercentage)) / 100;
  }

  const grandTotal = baseTotal + calculatedTip;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmBill({
      tableNumber,
      paymentMethod,
      cashDenomination: paymentMethod === 'cash' ? cashDenomination : null,
      tipPercentage,
      tipAmount: calculatedTip,
      baseTotal,
      grandTotal,
      wantsInvoice,
      rfc: wantsInvoice ? rfc.trim().toUpperCase() : null,
      email: wantsInvoice ? email.trim() : null
    });
  };

  const handleWhatsAppAlert = () => {
    const methodStr = paymentMethod === 'card' ? 'Terminal en Mesa (Tarjeta)' : `Efectivo ${cashDenomination ? `(Paga con: $${cashDenomination})` : ''}`;
    const invoiceStr = wantsInvoice ? `\n📄 Requiere Factura: RFC ${rfc || 'Pendiente'} (${email || 'Sin correo'})` : '';
    const message = `🧾 *SOLICITUD DE CUENTA - AHUMADOS & CARBÓN SMOKEHOUSE* 🧾
--------------------------------------------------
📍 *Mesa:* #${tableNumber || 'Sin especificar'}
💳 *Método de pago:* ${methodStr}
💰 *Consumo Base:* $${baseTotal.toFixed(2)} MXN
⭐ *Propina sugerida:* $${calculatedTip.toFixed(2)} MXN (${tipPercentage === 'custom' ? 'Monto libre' : `${tipPercentage}%`})
💵 *TOTAL ESPERADO:* $${grandTotal.toFixed(2)} MXN${invoiceStr}
--------------------------------------------------
Por favor llevar la cuenta / terminal a la mesa.`;

    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber || '526624175122'}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-bill-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 text-warmCream shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
        {/* Botón de cierre */}
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
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h3 id="request-bill-title" className="text-lg sm:text-xl font-black text-warmCream leading-tight">
              Pedir la Cuenta
            </h3>
            <span className="text-xs text-badgeGold font-bold tracking-wide">
              {cleanTableNumber(tableNumber) ? `📍 Mesa ${cleanTableNumber(tableNumber)}` : '📍 Servicio a mesa'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resumen de consumo actual */}
          <div className="bg-[#141414] border border-charcoalBorder rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-warmMuted font-bold uppercase tracking-wider block">
                Consumo Registrado
              </span>
              <span className="text-xs text-warmCream/80">
                {activeOrder ? `Folio ${activeOrder.folio}` : 'Total en comanda'}
              </span>
            </div>
            <span className="text-xl font-black text-flameOrange">
              ${baseTotal.toFixed(2)} MXN
            </span>
          </div>

          {/* Selector de Método de Pago */}
          <div>
            <label className="block text-xs font-bold text-warmMuted uppercase tracking-wider mb-2">
              ¿Cómo deseas pagar?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-xl border text-left font-semibold flex flex-col justify-between transition-all cursor-pointer select-none min-h-[52px] ${
                  paymentMethod === 'card'
                    ? 'bg-flameOrange/15 border-flameOrange text-warmCream shadow-md'
                    : 'bg-[#171717] border-charcoalBorder text-warmMuted hover:border-charcoalBorder/80 hover:text-warmCream'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <CreditCard className="w-5 h-5 text-flameOrange" />
                  {paymentMethod === 'card' && <Check className="w-4 h-4 text-flameOrange" />}
                </div>
                <span className="text-xs sm:text-sm font-bold">Tarjeta / Terminal</span>
                <span className="text-[10px] text-warmMuted mt-0.5">Terminal en mesa</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-xl border text-left font-semibold flex flex-col justify-between transition-all cursor-pointer select-none min-h-[52px] ${
                  paymentMethod === 'cash'
                    ? 'bg-flameOrange/15 border-flameOrange text-warmCream shadow-md'
                    : 'bg-[#171717] border-charcoalBorder text-warmMuted hover:border-charcoalBorder/80 hover:text-warmCream'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Banknote className="w-5 h-5 text-emerald-400" />
                  {paymentMethod === 'cash' && <Check className="w-4 h-4 text-flameOrange" />}
                </div>
                <span className="text-xs sm:text-sm font-bold">Efectivo</span>
                <span className="text-[10px] text-warmMuted mt-0.5">Llevamos tu cambio</span>
              </button>
            </div>

            {/* Opciones adicionales para efectivo */}
            {paymentMethod === 'cash' && (
              <div className="mt-3 p-3 rounded-xl bg-[#141414] border border-charcoalBorder space-y-2">
                <span className="text-xs text-warmCream/90 font-medium block">
                  ¿Con qué billete vas a pagar? (Opcional, para cambio exacto):
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Exacto', '200', '500', '1000'].map((denom) => (
                    <button
                      key={denom}
                      type="button"
                      onClick={() => setCashDenomination(denom === cashDenomination ? '' : denom)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        cashDenomination === denom
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-[#1a1a1a] border-charcoalBorder text-warmMuted hover:text-warmCream'
                      }`}
                    >
                      {denom === 'Exacto' ? 'Pago Exacto' : `$${denom}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Calculadora de Propina Sugerida */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-warmMuted uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-badgeGold" />
                Propina recomendada para el equipo
              </label>
              <span className="text-xs font-bold text-badgeGold">
                +${calculatedTip.toFixed(2)} MXN
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { pct: 0, label: '0%' },
                { pct: 10, label: '10%' },
                { pct: 15, label: '15% ⭐' },
                { pct: 20, label: '20%' }
              ].map((item) => {
                const isSelected = tipPercentage === item.pct;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setTipPercentage(item.pct);
                      setCustomTip('');
                    }}
                    className={`py-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-badgeGold/20 border-badgeGold text-badgeGold shadow-sm'
                        : 'bg-[#171717] border-charcoalBorder text-warmMuted hover:border-charcoalBorder/80 hover:text-warmCream'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checkbox de Facturación */}
          <div className="p-3.5 rounded-xl bg-[#141414] border border-charcoalBorder space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={wantsInvoice}
                onChange={(e) => setWantsInvoice(e.target.checked)}
                className="w-4 h-4 rounded text-flameOrange accent-flameOrange focus:ring-flameOrange cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-bold text-warmCream flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-warmMuted" />
                Requiero Factura CFDI
              </span>
            </label>

            {wantsInvoice && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-charcoalBorder/50">
                <input
                  type="text"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value)}
                  placeholder="RFC (12 o 13 caracteres)"
                  className="w-full bg-[#1c1c1c] border border-charcoalBorder rounded-lg px-3 py-2 text-xs text-warmCream placeholder:text-warmMuted/60 uppercase focus:outline-none focus:border-flameOrange"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo para envío de CFDI"
                  className="w-full bg-[#1c1c1c] border border-charcoalBorder rounded-lg px-3 py-2 text-xs text-warmCream placeholder:text-warmMuted/60 focus:outline-none focus:border-flameOrange"
                />
              </div>
            )}
          </div>

          {/* Total final a pagar con propina */}
          <div className="p-4 rounded-xl bg-[#111111] border border-charcoalBorder flex items-center justify-between">
            <div>
              <span className="text-[11px] text-warmMuted uppercase font-bold tracking-wider block">
                Total con Propina Incluida
              </span>
              <span className="text-xs text-warmCream/80">
                {paymentMethod === 'card' ? 'A cobrar en terminal' : 'En efectivo a mesero'}
              </span>
            </div>
            <span className="text-2xl font-black text-warmCream">
              ${grandTotal.toFixed(2)} MXN
            </span>
          </div>

          {/* Botón de confirmación */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-warmCream font-black py-3.5 px-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 transition-all cursor-pointer min-h-[48px]"
          >
            <Receipt className="w-5 h-5" />
            <span>CONFIRMAR Y SOLICITAR CUENTA 🧾</span>
          </button>

          {/* Opción secundaria WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppAlert}
            className="w-full text-xs text-warmMuted hover:text-emerald-400 py-1 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>O notificar directamente a caja por WhatsApp</span>
          </button>
        </form>
      </div>
    </div>
  );
}
