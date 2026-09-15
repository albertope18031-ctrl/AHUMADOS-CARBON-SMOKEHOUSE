import React, { useState, useEffect } from 'react';
import { X, Flame, Trash2, Plus, Minus, ShoppingBag, Lock } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { cleanTableNumber } from '../utils/textUtils';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  orderType = 'mesa',
  tableNumber = '',
  setTableNumber,
  isTableLocked = false,
  onConfirmInAppOrder,
  onOpenInvoiceModal
}) {
  const [internalTableNumber, setInternalTableNumber] = useState(tableNumber || '');
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sincronizar tableNumber externo si cambia
  useEffect(() => {
    if (tableNumber) {
      setInternalTableNumber(tableNumber);
    }
  }, [tableNumber]);

  // Manejador para cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Limpiar error al cambiar de tipo o cerrar
  useEffect(() => {
    setErrorMessage('');
  }, [orderType, isOpen]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = 0.0;
  const total = subtotal + serviceFee;

  const currentTable = isTableLocked ? tableNumber : internalTableNumber;
  const sanitizedTable = cleanTableNumber(currentTable);

  const handleSendOrder = () => {
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Tu orden está vacía. Agrega platillos para continuar.');
      return;
    }

    if (orderType === 'mesa') {
      if (!sanitizedTable) {
        setErrorMessage('Por favor especifica el Número de Mesa para llevarte tu orden.');
        return;
      }

      // Confirmar comanda digital in-app
      const now = new Date();
      const formattedNowTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const orderData = {
        folio: `#AC-${Math.floor(100 + Math.random() * 900)}`,
        orderType: 'mesa',
        tableNumber: sanitizedTable,
        items: [...cart],
        subtotal,
        serviceFee,
        total,
        timestamp: formattedNowTime,
        date: now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
        estimatedTime: '15 - 25 min',
        createdAt: Date.now()
      };

      if (onConfirmInAppOrder) {
        onConfirmInAppOrder(orderData);
      }
      return;
    }

    // Modalidad Para Llevar: Envío por WhatsApp
    if (!customerName.trim()) {
      setErrorMessage('Por favor indica el nombre de quien recoge el pedido.');
      return;
    }
    if (!pickupTime.trim()) {
      setErrorMessage('Por favor indica la hora estimada de entrega.');
      return;
    }

    const typeText = `Para Llevar a nombre de: ${customerName.trim()}`;
    const clientText = customerName.trim();
    const timeText = pickupTime.trim();

    let itemsDetailText = '';
    cart.forEach((item) => {
      itemsDetailText += `${item.quantity}x ${item.name} ($${item.price})\n`;
      if (item.selectedCookingPoint) {
        itemsDetailText += `   • Término: ${item.selectedCookingPoint}\n`;
      }
      if (item.selectedSide) {
        itemsDetailText += `   • Guarnición: ${item.selectedSide}\n`;
      }
      if (item.notes && item.notes.trim()) {
        itemsDetailText += `   • Notas: ${item.notes.trim()}\n`;
      }
    });

    const totalFormatted = total.toFixed(2);

    const message = `🔥 *NUEVA ORDEN - AHUMADOS & CARBÓN SMOKEHOUSE* 🔥
--------------------------------------------------
📍 *Tipo:* ${typeText}
👤 *Cliente:* ${clientText}
⏰ *Hora:* ${timeText}

📋 *DETALLE DEL PEDIDO:*
${itemsDetailText.trimEnd()}

💰 *TOTAL A PAGAR:* $${totalFormatted} MXN
--------------------------------------------------
Por favor confirma la recepción de este pedido para comenzar la preparación.`;

    const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber || '526624175122'}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay oscuro con desenfoque */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col h-full text-white animate-in slide-in-from-right duration-300">
          
          {/* Encabezado del Drawer */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-none">
                  Tu Orden
                </h2>
                <span className="text-xs text-neutral-400 mt-1 block">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.length === 1 ? 'platillo' : 'platillos'} agregados
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
              aria-label="Cerrar orden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3. Confirmación de Mesa Automática o Datos Para Llevar */}
          <div className="px-4 sm:px-5 pt-3.5 pb-1 shrink-0">
            {orderType === 'mesa' ? (
              <div className="space-y-2">
                {sanitizedTable ? (
                  /* Mesa ya asignada: Badge visual claro sin volver a pedir el input */
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📍</span>
                      <div>
                        <span className="text-[11px] text-neutral-400 block font-medium">Lugar de entrega:</span>
                        <span className="text-sm font-bold text-amber-400">
                          Pedido para Mesa {sanitizedTable}
                        </span>
                      </div>
                    </div>

                    {isTableLocked ? (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 flex items-center gap-1 font-semibold">
                        <Lock className="w-3 h-3" /> Fija por QR
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingTable(!isEditingTable)}
                        className="text-xs font-semibold text-neutral-400 hover:text-white underline underline-offset-2 transition-colors cursor-pointer px-1 py-0.5"
                      >
                        {isEditingTable ? 'Listo' : '(Cambiar)'}
                      </button>
                    )}
                  </div>
                ) : (
                  /* Mesa no asignada: Input limpio y compacto de 1 sola línea */
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor="cart-table-number" className="text-xs font-bold text-white whitespace-nowrap">
                        Mesa # <span className="text-amber-400">*</span>:
                      </label>
                      <input
                        id="cart-table-number"
                        type="text"
                        value={currentTable}
                        onChange={(e) => {
                          const cleaned = cleanTableNumber(e.target.value);
                          setInternalTableNumber(cleaned);
                          if (setTableNumber) setTableNumber(cleaned);
                        }}
                        placeholder="Ej. 4"
                        className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-formulario desplegable si el cliente desea cambiar la mesa */}
                {isEditingTable && !isTableLocked && sanitizedTable && (
                  <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={currentTable}
                      onChange={(e) => {
                        const cleaned = cleanTableNumber(e.target.value);
                        setInternalTableNumber(cleaned);
                        if (setTableNumber) setTableNumber(cleaned);
                      }}
                      placeholder="Nuevo número de mesa"
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingTable(false)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      Guardar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Modalidad Para Llevar: Campos compactos */
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 pb-1.5 border-b border-neutral-800 text-xs font-bold text-white">
                  <span>🛍️</span>
                  <span>Datos para Recoger</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="cart-customer-name" className="block text-[10px] font-semibold text-neutral-400 mb-0.5">
                      Nombre <span className="text-amber-400">*</span>
                    </label>
                    <input
                      id="cart-customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Quién recoge"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="cart-pickup-time" className="block text-[10px] font-semibold text-neutral-400 mb-0.5">
                      Hora estimada <span className="text-amber-400">*</span>
                    </label>
                    <input
                      id="cart-pickup-time"
                      type="text"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      placeholder="Ej. En 25 min"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mensaje de error si la validación falla */}
          {errorMessage && (
            <div className="mx-4 sm:mx-5 mt-2 p-2.5 rounded-lg bg-red-950/60 border border-red-800/80 text-xs text-red-200 shrink-0">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* 4. Lista de Platillos Limpia y Fluida (Scrollable Body) */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-2.5 min-h-0">
            {cart.length === 0 ? (
              /* Estado de Carrito Vacío */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 select-none">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3 text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-bold text-white text-base">Tu orden aún no tiene platillos</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
                  Explora nuestros cortes a la leña, ahumados y especialidades al carbón para comenzar tu orden.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Explorar menú
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemSubtotal = (item.price * item.quantity).toFixed(2);
                const cleanItemName = item.name.replace(/\s*\([^)]*\)$/, '').trim();
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80 space-y-2 hover:border-neutral-700/80 transition-colors"
                  >
                    {/* Fila principal: Thumbnail, Nombre y precio */}
                    <div className="flex items-start gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            if (!e.target.dataset.triedJpg && item.image?.endsWith('.png')) {
                              e.target.dataset.triedJpg = 'true';
                              e.target.src = item.image + '.jpg';
                            } else {
                              e.target.style.display = 'none';
                            }
                          }}
                          className="w-14 h-14 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-white text-sm leading-snug">
                            {cleanItemName}
                          </h4>
                          <span className="text-amber-400 font-bold text-sm whitespace-nowrap">
                            ${itemSubtotal}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400 block mt-0.5">
                          ${Number(item.price).toFixed(2)} c/u
                        </span>

                        {/* Guarnición, término y notas de cocina en texto gris legible */}
                        {(item.selectedCookingPoint || item.selectedSide || item.notes) && (
                          <div className="mt-1.5 pt-1.5 border-t border-neutral-800/60 text-xs text-neutral-400 space-y-0.5">
                            {item.selectedCookingPoint && (
                              <div className="flex items-center gap-1">
                                <span className="text-amber-400">🔥</span>
                                <span>Término: <strong className="text-neutral-300 font-medium">{item.selectedCookingPoint}</strong></span>
                              </div>
                            )}
                            {item.selectedSide && (
                              <div className="flex items-center gap-1">
                                <span className="text-amber-400">🍟</span>
                                <span>Guarnición: <strong className="text-neutral-300 font-medium">{item.selectedSide}</strong></span>
                              </div>
                            )}
                            {item.notes && item.notes.trim() && (
                              <div className="flex items-start gap-1">
                                <span className="text-neutral-400">📝</span>
                                <span className="italic text-neutral-300 break-words">{item.notes.trim()}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Controles de cantidad compactos y táctiles + botón eliminar */}
                    <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onRemoveItem && onRemoveItem(index)}
                        className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer p-1"
                        aria-label="Eliminar platillo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Eliminar</span>
                      </button>

                      <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateQuantity && onUpdateQuantity(index, item.quantity - 1);
                            } else {
                              onRemoveItem && onRemoveItem(index);
                            }
                          }}
                          className="w-7 h-7 rounded flex items-center justify-center text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(index, item.quantity + 1)}
                          className="w-7 h-7 rounded flex items-center justify-center text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 1 & 2. Pie de Carrito Fijo (Sticky Bottom Footer) */}
          {cart.length > 0 && (
            <footer className="sticky bottom-0 bg-neutral-950 border-t border-neutral-800 p-4 sm:p-5 shadow-2xl shrink-0 z-20 space-y-3">
              {/* Resumen de cobro con tipografía clara */}
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Total a pagar
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                  ${total.toFixed(2)} <span className="text-xs font-medium text-neutral-400">MXN</span>
                </span>
              </div>

              {/* Desglose sutil y en una sola línea discreta */}
              <p className="text-[11px] text-neutral-400 text-center leading-tight">
                Precios netos con IVA incluido • Propina voluntaria
              </p>

              {/* Botón principal de confirmación a todo lo ancho */}
              <button
                type="button"
                onClick={handleSendOrder}
                className="w-full h-12 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base tracking-wide"
              >
                {orderType === 'mesa' ? (
                  <span>ENVIAR COMANDA A COCINA 🔥</span>
                ) : (
                  <span>CONFIRMAR Y PEDIR POR WHATSAPP 📲</span>
                )}
              </button>

              {/* Formas de pago compactas en una sola línea minimalista + enlace a factura CFDI */}
              <div className="pt-2 border-t border-neutral-800/70 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-neutral-400 text-center sm:text-left">
                <span className="flex items-center gap-1.5 justify-center text-[11px]">
                  <span>💳 Tarjeta en mesa</span>
                  <span>•</span>
                  <span>💵 Efectivo</span>
                  <span>•</span>
                  <span>📲 Transferencia</span>
                </span>
                {onOpenInvoiceModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenInvoiceModal();
                    }}
                    className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer text-[11px] font-medium"
                  >
                    ¿Requieres factura CFDI?
                  </button>
                )}
              </div>
            </footer>
          )}

        </aside>
      </div>
    </div>
  );
}
