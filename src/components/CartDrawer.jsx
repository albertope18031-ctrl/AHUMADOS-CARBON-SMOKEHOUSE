import React, { useState, useEffect } from 'react';
import { X, Flame, Trash2, Plus, Minus, Send, ShoppingBag, Utensils, Clock, User, Hash } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  orderType = 'mesa',
  setOrderType
}) {
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSendOrder = () => {
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Tu orden está vacía. Agrega platillos para continuar.');
      return;
    }

    if (orderType === 'mesa') {
      if (!tableNumber.trim()) {
        setErrorMessage('Por favor especifica el Número de Mesa para llevarte tu orden.');
        return;
      }
    } else {
      if (!customerName.trim()) {
        setErrorMessage('Por favor indica el nombre de quien recoge el pedido.');
        return;
      }
      if (!pickupTime.trim()) {
        setErrorMessage('Por favor indica la hora estimada de entrega.');
        return;
      }
    }

    // Formatear hora actual para consumo en mesa
    const now = new Date();
    const formattedNowTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const typeText =
      orderType === 'mesa'
        ? `Consumo en Mesa (Mesa #${tableNumber.trim()})`
        : `Para Llevar a nombre de: ${customerName.trim()}`;

    const clientText =
      orderType === 'mesa'
        ? customerName.trim() ? customerName.trim() : `Mesa #${tableNumber.trim()}`
        : customerName.trim();

    const timeText = orderType === 'mesa' ? formattedNowTime : pickupTime.trim();

    // Generar bloque de platillos detallado
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

    // Mensaje con formato exacto solicitado
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
                <span>En Mesa</span>
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
                <label
                  htmlFor="cart-table-number"
                  className="block text-xs font-bold text-warmCream mb-1 flex items-center gap-1.5"
                >
                  <Hash className="w-3.5 h-3.5 text-flameOrange" />
                  Número de Mesa <span className="text-flameOrange">*</span>
                </label>
                <input
                  id="cart-table-number"
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Ej. Mesa 5"
                  className="w-full bg-[#171717] border border-charcoalBorder rounded-lg px-3 py-2 text-sm text-warmCream placeholder:text-warmMuted/60 focus:outline-none focus:border-flameOrange transition-colors"
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
            <div className="p-5 border-t border-charcoalBorder bg-charcoalCard/80 space-y-4">
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
              </div>

              <button
                type="button"
                onClick={handleSendOrder}
                className="bg-flameOrange hover:bg-flameOrangeHover text-warmCream font-black py-4 rounded-xl text-center text-sm sm:text-base tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer w-full transition-all active:scale-[0.98]"
              >
                <span>ENVIAR PEDIDO A COCINA POR WHATSAPP 📲</span>
              </button>

              <p className="text-[11px] text-center text-warmMuted leading-tight">
                Al enviar tu pedido se abrirá tu aplicación de WhatsApp lista para despachar tu orden directamente a cocina.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
