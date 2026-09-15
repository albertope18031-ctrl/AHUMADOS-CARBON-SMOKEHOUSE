import React, { useState, useEffect } from 'react';
import { Receipt, CreditCard, Banknote, FileText, Check, X, MessageSquare, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { cleanTableNumber } from '../utils/textUtils';

export default function RequestBillModal({
  isOpen,
  tableNumber = '',
  activeOrder = null,
  cartTotal = 0,
  onClose,
  onConfirmBill,
  onResetAccount
}) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cash'
  const [cashDenomination, setCashDenomination] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15); // 0, 10, 15, 20, 'custom'
  const [customTip, setCustomTip] = useState('');
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [rfc, setRfc] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reiniciar estado de envío al abrir modal
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
    }
  }, [isOpen]);

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
  const sanitizedTable = cleanTableNumber(tableNumber);

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
    if (onConfirmBill) {
      onConfirmBill({
        tableNumber: sanitizedTable,
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
    }
    // Pasar a la pantalla de confirmación con la opción de finalizar visita
    setIsSubmitted(true);
  };

  const handleWhatsAppAlert = () => {
    const methodStr = paymentMethod === 'card' ? 'Terminal en Mesa (Tarjeta)' : `Efectivo ${cashDenomination ? `(Paga con: $${cashDenomination})` : ''}`;
    const invoiceStr = wantsInvoice ? `\n📄 Requiere Factura: RFC ${rfc || 'Pendiente'} (${email || 'Sin correo'})` : '';
    const message = `🧾 *SOLICITUD DE CUENTA - AHUMADOS & CARBÓN SMOKEHOUSE* 🧾
--------------------------------------------------
📍 *Mesa:* ${sanitizedTable ? `Mesa ${sanitizedTable}` : 'Sin especificar'}
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

        {isSubmitted ? (
          /* Pantalla de Confirmación de Cobro: Acción Finalizar Visita / Liberar Mesa */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 animate-in zoom-in" />
            </div>

            <div>
              <h3 id="request-bill-title" className="text-xl font-black text-white">
                ¡Cuenta Solicitada a Caja! 🧾
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed max-w-sm mx-auto">
                Hemos avisado al personal. En breve un mesero acudirá a tu mesa con la cuenta y tu método de cobro ({paymentMethod === 'card' ? 'Terminal bancaria' : 'Efectivo'}).
              </p>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-left space-y-2">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Ubicación:</span>
                <span className="font-bold text-amber-400">📍 Mesa {sanitizedTable || 'Actual'}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Método indicado:</span>
                <span className="font-medium text-white">{paymentMethod === 'card' ? 'Tarjeta en mesa' : 'Efectivo'}</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                <span>Total a Pagar con Propina:</span>
                <span className="text-emerald-400 text-base">${grandTotal.toFixed(2)} MXN</span>
              </div>
            </div>

            {/* Acción Principal Requerida: Finalizar visita / Liberar mesa */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  if (onResetAccount) {
                    onResetAccount();
                  }
                  onClose();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <span>✅ Finalizar visita / Liberar mesa</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Volver al menú
              </button>
            </div>
          </div>
        ) : (
          /* Formulario de Solicitud de Cuenta */
          <>
            {/* Encabezado */}
            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h3 id="request-bill-title" className="text-lg sm:text-xl font-black text-warmCream leading-tight">
                  Pedir la Cuenta
                </h3>
                <span className="text-xs text-amber-400 font-bold tracking-wide">
                  {sanitizedTable ? `📍 Mesa ${sanitizedTable}` : '📍 Servicio a mesa'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Resumen de consumo actual */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider block">
                    Consumo Registrado
                  </span>
                  <span className="text-xs text-neutral-300">
                    {activeOrder ? `Comanda ${activeOrder.folio}` : 'Total en comanda'}
                  </span>
                </div>
                <span className="text-xl font-black text-flameOrange">
                  ${baseTotal.toFixed(2)} MXN
                </span>
              </div>

              {/* Selector de Método de Pago */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  ¿Cómo deseas pagar?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border text-left font-semibold flex flex-col justify-between transition-all cursor-pointer select-none min-h-[52px] ${
                      paymentMethod === 'card'
                        ? 'bg-flameOrange/15 border-flameOrange text-white shadow-md'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <CreditCard className="w-5 h-5 text-flameOrange" />
                      {paymentMethod === 'card' && <Check className="w-4 h-4 text-flameOrange" />}
                    </div>
                    <span className="text-xs sm:text-sm font-bold">Tarjeta / Terminal</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">Terminal en mesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3.5 rounded-xl border text-left font-semibold flex flex-col justify-between transition-all cursor-pointer select-none min-h-[52px] ${
                      paymentMethod === 'cash'
                        ? 'bg-flameOrange/15 border-flameOrange text-white shadow-md'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Banknote className="w-5 h-5 text-emerald-400" />
                      {paymentMethod === 'cash' && <Check className="w-4 h-4 text-flameOrange" />}
                    </div>
                    <span className="text-xs sm:text-sm font-bold">Efectivo</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">Llevamos tu cambio</span>
                  </button>
                </div>

                {/* Opciones adicionales para efectivo */}
                {paymentMethod === 'cash' && (
                  <div className="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <span className="text-xs text-neutral-300 font-medium block">
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
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
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
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Propina sugerida
                  </label>
                  <span className="text-xs font-bold text-amber-400">
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
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checkbox de Facturación */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wantsInvoice}
                    onChange={(e) => setWantsInvoice(e.target.checked)}
                    className="w-4 h-4 rounded text-flameOrange accent-flameOrange focus:ring-flameOrange cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    Requiero Factura CFDI
                  </span>
                </label>

                {wantsInvoice && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                    <input
                      type="text"
                      value={rfc}
                      onChange={(e) => setRfc(e.target.value)}
                      placeholder="RFC (12 o 13 caracteres)"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 uppercase focus:outline-none focus:border-flameOrange"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Correo para envío de CFDI"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-flameOrange"
                    />
                  </div>
                )}
              </div>

              {/* Total final a pagar con propina */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider block">
                    Total con Propina Incluida
                  </span>
                  <span className="text-xs text-neutral-300">
                    {paymentMethod === 'card' ? 'Terminal inalámbrica en mesa' : 'En efectivo a mesero'}
                  </span>
                </div>
                <span className="text-2xl font-black text-white">
                  ${grandTotal.toFixed(2)} MXN
                </span>
              </div>

              {/* Botón de confirmación */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black py-3.5 px-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 transition-all cursor-pointer min-h-[48px]"
              >
                <Receipt className="w-5 h-5" />
                <span>CONFIRMAR Y SOLICITAR CUENTA 🧾</span>
              </button>

              {/* Opción secundaria WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppAlert}
                className="w-full text-xs text-neutral-400 hover:text-emerald-400 py-1 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>O avisar a caja por WhatsApp</span>
              </button>

              {/* 4. Botón de Reinicio para Pruebas (Dev / Reset) */}
              <div className="pt-2 border-t border-neutral-800/80 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (onResetAccount) {
                      onResetAccount();
                    }
                    onClose();
                  }}
                  className="text-xs text-neutral-500 hover:text-red-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-neutral-800/60"
                  title="Elimina comanda activa y restablece cuenta a $0.00 MXN para pruebas"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar comanda de prueba</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
