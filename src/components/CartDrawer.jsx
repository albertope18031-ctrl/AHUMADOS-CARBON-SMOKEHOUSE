import React, { useState, useEffect } from 'react';
import { X, Flame, Trash2, Plus, Minus, Send, ShoppingBag, Utensils, Clock, User, Hash, Lock, CreditCard, FileText, ChevronDown } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { cleanTableNumber } from '../utils/textUtils';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  orderType = 'mesa',
  setOrderType,
  tableNumber = '',
  setTableNumber,
  isTableLocked = false,
  onConfirmInAppOrder,
  onOpenInvoiceModal
}) {
  const [internalTableNumber, setInternalTableNumber] = useState(tableNumber || '');
  const [customerName, setCustomerName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isInvoiceAccordionOpen, setIsInvoiceAccordionOpen] = useState(false);

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

  const handleSendOrder = () => {
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Tu orden está vacía. Agrega platillos para continuar.');
      return;
    }

    if (orderType === 'mesa') {
      if (!currentTable.trim()) {
        setErrorMessage('Por favor especifica el Número de Mesa para llevarte tu orden.');
        return;
      }

      // Si el comensal está en mesa, confirmar in-app directamente
      const now = new Date();
      const formattedNowTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const orderData = {
        folio: `#AC-${Math.floor(100 + Math.random() * 900)}`,
        orderType: 'mesa',
        tableNumber: currentTable.trim(),
        items: [...cart],
        subtotal,
        serviceFee,
        total,
        timestamp: formattedNowTime,
        date: now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
        estimatedTime: '15 - 25 min'
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
      {/* Overlay oscuro desenfocado */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-charcoal border-l border-charcoalBorder shadow-2xl flex flex-col text-warmCream animate-in slide-in-from-right duration-300">
          {/* Encabezado del Drawer */}
          <div className="p-5 border-b border-charcoalBorder flex items-center justify-between bg-charcoalCard/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-flameOrange/15 text-flameOrange border border-flameOrange/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-warmCream leading-none">
                  Tu Orden en Fuego
                </h2>
                <span className="text-xs text-warmMuted mt-1 block">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.length === 1 ? 'producto' : 'productos'} en la comanda
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-warmMuted hover:text-warmCream bg-[#171717] hover:bg-[#252525] border border-charcoalBorder transition-colors cursor-pointer"
              aria-label="Cerrar orden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selector interactivo de Modalidad en el carrito */}
          <div className="px-5 pt-4">
            <div className="bg-[#121212] p-1 rounded-xl border border-charcoalBorder flex items-center">
              <button
                type="button"
                onClick={() => setOrderType && setOrderType('mesa')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  orderType === 'mesa'
                    ? 'bg-flameOrange text-warmCream shadow-md'
                    : 'text-warmMuted hover:text-warmCream'
                }`}
              >
                <span>🍽️</span>
                <span>En Mesa {cleanTableNumber(currentTable) ? `(Mesa ${cleanTableNumber(currentTable)})` : ''}</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType && setOrderType('llevar')}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  orderType === 'llevar'
                    ? 'bg-flameOrange text-warmCream shadow-md'
                    : 'text-warmMuted hover:text-warmCream'
                }`}
              >
                <span>🛍️</span>
                <span>Para Llevar</span>
              </button>
            </div>
          </div>

          {/* Formulario de campos requeridos según la modalidad */}
          <div className="px-5 pt-3 pb-2">
            {orderType === 'mesa' ? (
              <div className="bg-charcoalCard/90 border border-charcoalBorder rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="cart-table-number"
                    className="text-xs font-bold text-warmCream flex items-center gap-1.5"
                  >
                    <Hash className="w-3.5 h-3.5 text-flameOrange" />
                    Número de Mesa <span className="text-flameOrange">*</span>
                  </label>
                  {isTableLocked && (
                    <span className="text-[10px] text-badgeGold bg-badgeGold/10 px-2 py-0.5 rounded border border-badgeGold/20 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Asignada por QR
                    </span>
                  )}
                </div>

                <input
                  id="cart-table-number"
                  type="text"
                  value={currentTable}
                  readOnly={isTableLocked}
                  onChange={(e) => {
                    if (!isTableLocked) {
                      const cleaned = cleanTableNumber(e.target.value);
                      setInternalTableNumber(cleaned);
                      if (setTableNumber) setTableNumber(cleaned);
                    }
                  }}
                  placeholder="Ej. 5"
                  className={`w-full bg-[#171717] border border-charcoalBorder rounded-lg px-3 py-2 text-sm text-warmCream placeholder:text-warmMuted/60 transition-colors ${
                    isTableLocked ? 'cursor-not-allowed text-badgeGold font-bold bg-[#131313]' : 'focus:outline-none focus:border-flameOrange'
                  }`}
                />
              </div>
            ) : (
              <div className="bg-charcoalCard/90 border border-charcoalBorder rounded-xl p-3 space-y-3">
                <div>
                  <label
                    htmlFor="cart-customer-name"
                    className="block text-xs font-bold text-warmCream mb-1 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-flameOrange" />
                    Nombre de quien recoge <span className="text-flameOrange">*</span>
                  </label>
                  <input
                    id="cart-customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full bg-[#171717] border border-charcoalBorder rounded-lg px-3 py-2 text-sm text-warmCream placeholder:text-warmMuted/60 focus:outline-none focus:border-flameOrange transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cart-pickup-time"
                    className="block text-xs font-bold text-warmCream mb-1 flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-flameOrange" />
                    Hora estimada de entrega <span className="text-flameOrange">*</span>
                  </label>
                  <input
                    id="cart-pickup-time"
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder="Ej. 8:30 PM o En 25 minutos"
                    className="w-full bg-[#171717] border border-charcoalBorder rounded-lg px-3 py-2 text-sm text-warmCream placeholder:text-warmMuted/60 focus:outline-none focus:border-flameOrange transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mensaje de error de validación */}
          {errorMessage && (
            <div className="mx-5 mb-2 p-2.5 rounded-lg bg-red-950/50 border border-red-800/60 text-xs text-red-200">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Lista de platillos agregados (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-warmMuted">
                <ShoppingBag className="w-12 h-12 text-warmMuted/40 mb-3" />
                <p className="font-bold text-warmCream text-base">Aún no hay fuego en tu comanda</p>
                <p className="text-xs text-warmMuted mt-1 max-w-xs">
                  Explora nuestros cortes a la leña, ahumados y hamburguesas al carbón para comenzar tu orden.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 px-4 py-2 rounded-lg bg-charcoalCard border border-charcoalBorder text-xs font-bold text-warmCream hover:border-flameOrange transition-colors cursor-pointer"
                >
                  Explorar la Carta
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemSubtotal = (item.price * item.quantity).toFixed(2);
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="p-3.5 rounded-xl bg-charcoalCard border border-charcoalBorder space-y-2.5 hover:border-charcoalBorder/90 transition-colors"
                  >
                    {/* Fila principal: Thumbnail, Nombre y subtotal */}
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
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-neutral-900 border border-charcoalBorder shadow-sm"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-warmCream text-sm leading-snug truncate">
                            {item.name}
                          </h4>
                          <span className="text-flameOrange font-extrabold text-sm whitespace-nowrap">
                            ${itemSubtotal}
                          </span>
                        </div>
                        <span className="text-[11px] text-warmMuted block mt-0.5">
                          ${Number(item.price).toFixed(2)} c/u
                        </span>
                      </div>
                    </div>

                    {/* Desglose de personalización */}
                    {(item.selectedCookingPoint || item.selectedSide || item.notes) && (
                      <div className="p-2 rounded-lg bg-[#171717] border border-charcoalBorder/70 text-[11px] space-y-1 text-warmMuted">
                        {item.selectedCookingPoint && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-flameOrange">🔥 Término:</span>
                            <span className="text-warmCream font-medium truncate">
                              {item.selectedCookingPoint}
                            </span>
                          </div>
                        )}
                        {item.selectedSide && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-badgeGold">🍟 Guarnición:</span>
                            <span className="text-warmCream font-medium truncate">
                              {item.selectedSide}
                            </span>
                          </div>
                        )}
                        {item.notes && (
                          <div className="flex items-start gap-1.5">
                            <span className="text-warmCream/80 font-medium">📝 Notas:</span>
                            <span className="text-warmMuted italic break-words">
                              {item.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Controles de cantidad y eliminación */}
                    <div className="pt-2 border-t border-charcoalBorder/50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onRemoveItem && onRemoveItem(index)}
                        className="text-xs text-warmMuted hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer p-1"
                        aria-label="Eliminar platillo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Eliminar</span>
                      </button>

                      <div className="flex items-center gap-2 bg-[#171717] border border-charcoalBorder rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateQuantity && onUpdateQuantity(index, item.quantity - 1);
                            } else {
                              onRemoveItem && onRemoveItem(index);
                            }
                          }}
                          className="w-7 h-7 rounded flex items-center justify-center text-warmCream hover:bg-charcoalCard transition-colors cursor-pointer"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-warmCream select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity && onUpdateQuantity(index, item.quantity + 1)}
                          className="w-7 h-7 rounded flex items-center justify-center text-warmCream hover:bg-charcoalCard transition-colors cursor-pointer"
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

          {/* Resumen de cuenta & Botón de Enviar Pedido */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-charcoalBorder bg-charcoalCard/85 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5 text-xs text-warmMuted">
                <div className="flex items-center justify-between">
                  <span>Subtotal de consumo</span>
                  <span className="text-warmCream font-medium">${subtotal.toFixed(2)} MXN</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Costo de envío / servicio</span>
                  <span className="text-green-400 font-bold">$0.00 MXN</span>
                </div>
                <div className="pt-2 border-t border-charcoalBorder flex items-center justify-between text-base font-extrabold text-warmCream">
                  <span>TOTAL A PAGAR</span>
                  <span className="text-flameOrange font-black text-lg">
                    ${total.toFixed(2)} MXN
                  </span>
                </div>

                {/* 2. Políticas de Precios, Impuestos y Propina */}
                <div className="pt-2.5 mt-2 border-t border-charcoalBorder/50 space-y-1 text-[11px] text-warmMuted/90">
                  <div className="flex items-center gap-1.5 text-green-400/90 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    <span>Todos nuestros precios incluyen IVA (precios netos en MXN).</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-badgeGold/90 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-badgeGold flex-shrink-0" />
                    <span>La propina es 100% voluntaria conforme a las disposiciones oficiales.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-warmCream/75 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-flameOrange flex-shrink-0" />
                    <span>Sin cargos ocultos por servicio ni comisiones adicionales por pago con tarjeta.</span>
                  </div>
                </div>
              </div>

              {/* 1. Transparencia de Métodos de Pago en el Carrito */}
              <div className="border border-neutral-800 bg-neutral-900/60 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-warmCream flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-flameOrange" />
                    Formas de pago aceptadas
                  </span>
                  <span className="text-[10px] text-warmMuted font-medium bg-[#171717] px-2 py-0.5 rounded border border-charcoalBorder">
                    En Mesa o Caja
                  </span>
                </div>

                {/* Badges de métodos */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-[#171717] border border-charcoalBorder/70 rounded-lg p-2 flex flex-col items-center">
                    <span className="text-base mb-0.5">💳</span>
                    <span className="font-bold text-warmCream text-[11px] leading-none">Tarjetas</span>
                    <span className="text-[9px] text-warmMuted mt-1 leading-tight">Visa, MC, AMEX</span>
                  </div>
                  <div className="bg-[#171717] border border-charcoalBorder/70 rounded-lg p-2 flex flex-col items-center">
                    <span className="text-base mb-0.5">💵</span>
                    <span className="font-bold text-warmCream text-[11px] leading-none">Efectivo</span>
                    <span className="text-[9px] text-warmMuted mt-1 leading-tight">Llevamos cambio</span>
                  </div>
                  <div className="bg-[#171717] border border-charcoalBorder/70 rounded-lg p-2 flex flex-col items-center">
                    <span className="text-base mb-0.5">📲</span>
                    <span className="font-bold text-warmCream text-[11px] leading-none">SPEI</span>
                    <span className="text-[9px] text-warmMuted mt-1 leading-tight">Transferencia</span>
                  </div>
                </div>

                {/* Nota de cobro en mesa */}
                <p className="text-[10.5px] text-warmCream/70 leading-relaxed flex items-start gap-1.5 bg-[#171717]/60 p-2 rounded-lg border border-charcoalBorder/40">
                  <span className="text-flameOrange text-xs flex-shrink-0">ℹ️</span>
                  <span>
                    El cobro se realiza directamente en tu mesa con terminal inalámbrica o en caja al retirarte.
                  </span>
                </p>
              </div>

              {/* Botón de Confirmación de Pedido */}
              {orderType === 'mesa' ? (
                <div>
                  <button
                    type="button"
                    onClick={handleSendOrder}
                    className="bg-flameOrange hover:bg-flameOrangeHover active:scale-[0.98] text-warmCream font-black py-4 rounded-xl text-center text-sm sm:text-base tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer w-full transition-all"
                  >
                    <span>CONFIRMAR PEDIDO A COCINA 🔥</span>
                  </button>
                  <p className="text-[11px] text-center text-warmMuted mt-1.5 leading-tight">
                    Tu orden se enviará a cocina de inmediato y se generará tu comanda digital en pantalla.
                  </p>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={handleSendOrder}
                    className="bg-flameOrange hover:bg-flameOrangeHover active:scale-[0.98] text-warmCream font-black py-4 rounded-xl text-center text-sm sm:text-base tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer w-full transition-all"
                  >
                    <span>ENVIAR PEDIDO A COCINA POR WHATSAPP 📲</span>
                  </button>
                  <p className="text-[11px] text-center text-warmMuted mt-1.5 leading-tight">
                    Al enviar tu pedido se abrirá WhatsApp lista para despachar tu pedido para recoger.
                  </p>
                </div>
              )}

              {/* 3. Módulo de Facturación Electrónica (CFDI) */}
              <div className="border border-charcoalBorder bg-[#141414] rounded-xl overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setIsInvoiceAccordionOpen(!isInvoiceAccordionOpen)}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-charcoalCard transition-colors cursor-pointer select-none"
                >
                  <span className="font-bold text-warmCream flex items-center gap-2 text-xs">
                    <FileText className="w-3.5 h-3.5 text-badgeGold" />
                    ¿Requieres Factura Electrónica (CFDI)?
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-warmMuted transition-transform duration-200 ${
                      isInvoiceAccordionOpen ? 'rotate-180 text-flameOrange' : ''
                    }`}
                  />
                </button>

                {isInvoiceAccordionOpen && (
                  <div className="p-3 border-t border-charcoalBorder/60 bg-[#101010] text-[11px] text-warmMuted space-y-2 animate-in fade-in duration-150">
                    <p className="leading-relaxed">
                      Puedes solicitar tu factura al momento de pagar indicando tu <strong className="text-warmCream font-bold">RFC</strong> al mesero en sala, o enviando foto de tu ticket con tus datos fiscales a nuestro correo o WhatsApp:
                    </p>
                    <div className="bg-[#171717] p-2 rounded-lg border border-charcoalBorder/80 space-y-1">
                      <div className="flex items-center justify-between text-warmCream">
                        <span className="text-warmMuted">Correo de Facturación:</span>
                        <span className="font-mono text-badgeGold font-semibold text-[10.5px]">{RESTAURANT_INFO.billingEmail}</span>
                      </div>
                      <div className="flex items-center justify-between text-warmCream">
                        <span className="text-warmMuted">WhatsApp Facturación:</span>
                        <span className="font-mono text-green-400 font-semibold">{RESTAURANT_INFO.phoneDisplay}</span>
                      </div>
                    </div>
                    {onOpenInvoiceModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenInvoiceModal();
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-charcoalCard hover:bg-[#252525] border border-charcoalBorder text-warmCream text-center font-bold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3 h-3 text-badgeGold" />
                        <span>Ver requisitos completos y solicitar CFDI</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
