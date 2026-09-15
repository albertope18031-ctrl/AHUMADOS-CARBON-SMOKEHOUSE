import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import DishCard from './components/DishCard';
import CustomizationModal from './components/CustomizationModal';
import CartDrawer from './components/CartDrawer';
import MobileBottomCart from './components/MobileBottomCart';
import OrderSuccessModal from './components/OrderSuccessModal';
import TableServiceBar from './components/TableServiceBar';
import CallWaiterModal from './components/CallWaiterModal';
import RequestBillModal from './components/RequestBillModal';
import ToastNotification from './components/ToastNotification';
import Footer from './components/Footer';
import { Receipt, Flame } from 'lucide-react';
import { CATEGORIES, DISHES } from './data/menuData';
import { sendServiceNotification } from './utils/serviceNotifications';

export default function App() {
  // 1. Detección automática de mesa vía URL (?mesa=4 o ?table=4) o localStorage
  const [tableNumber, setTableNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramTable = params.get('mesa') || params.get('table');
      if (paramTable) {
        try {
          localStorage.setItem('smokehouse_table', paramTable);
        } catch (e) {}
        return paramTable;
      }
      try {
        return localStorage.getItem('smokehouse_table') || '';
      } catch (e) {
        return '';
      }
    }
    return '';
  });

  const [isTableLocked, setIsTableLocked] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get('mesa') || params.get('table'));
    }
    return false;
  });

  // Modalidad de orden: si viene mesa en URL, se fuerza 'mesa'
  const [orderType, setOrderType] = useState('mesa');

  // Estados del carrito y navegación
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]?.id || 'ahumados');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDishForCustomization, setSelectedDishForCustomization] = useState(null);

  // 2. Persistencia de comanda activa confirmada en mesa (ticket in-app)
  const [activeConfirmedOrder, setActiveConfirmedOrder] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('smokehouse_active_order');
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // 3. Módulo de Asistencia en Sala (Llamar mesero / Pedir cuenta / Toasts / Cooldown)
  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const [isRequestBillOpen, setIsRequestBillOpen] = useState(false);
  const [waiterCooldown, setWaiterCooldown] = useState(0);
  const [activeToast, setActiveToast] = useState(null);

  // Temporizador de bloqueo (cooldown de 75 segundos)
  useEffect(() => {
    if (waiterCooldown <= 0) return;
    const interval = setInterval(() => {
      setWaiterCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [waiterCooldown]);

  // Filtrado de platillos según categoría activa
  const filteredDishes = DISHES.filter((dish) => dish.categoryId === activeCategory);

  // Totales de la orden activa en carrito
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Abrir modal de personalización
  const handleOpenCustomize = (dish) => {
    setSelectedDishForCustomization(dish);
  };

  // Cerrar modal de personalización
  const handleCloseCustomize = () => {
    setSelectedDishForCustomization(null);
  };

  // Agregar platillo directo (sin opciones obligatorias)
  const handleDirectAddToCart = (dish) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === dish.id &&
          !item.selectedCookingPoint &&
          !item.selectedSide &&
          !item.notes
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...dish,
          quantity: 1,
          selectedCookingPoint: null,
          selectedSide: null,
          notes: ''
        }
      ];
    });
  };

  // Confirmar y agregar platillo personalizado desde el modal
  const handleConfirmCustomization = (customizedItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === customizedItem.id &&
          item.selectedCookingPoint === customizedItem.selectedCookingPoint &&
          item.selectedSide === customizedItem.selectedSide &&
          item.notes === customizedItem.notes
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + customizedItem.quantity
        };
        return updated;
      }

      return [...prev, customizedItem];
    });
  };

  // Actualizar cantidad de un item en el carrito
  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: newQuantity
      };
      return updated;
    });
  };

  // Eliminar un item del carrito
  const handleRemoveItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Confirmación In-App de la comanda en mesa (sin salir a WhatsApp)
  const handleConfirmInAppOrder = (orderData) => {
    setActiveConfirmedOrder(orderData);
    try {
      localStorage.setItem('smokehouse_active_order', JSON.stringify(orderData));
      if (orderData.tableNumber) {
        localStorage.setItem('smokehouse_table', orderData.tableNumber);
      }
    } catch (e) {
      console.error(e);
    }
    // Vaciar el carrito actual tras confirmar la orden para evitar duplicaciones
    setCart([]);
    setIsCartOpen(false);
    setIsSuccessModalOpen(true);
  };

  // Despacho de llamada a mesero con notificación inmediata y cooldown
  const handleConfirmCallWaiter = (requestDetails) => {
    sendServiceNotification(requestDetails.tableNumber || tableNumber, 'call_waiter', requestDetails);
    setWaiterCooldown(75); // Cooldown preventivo de 75 segundos
    setIsCallWaiterOpen(false);
    setActiveToast({
      type: 'waiter',
      title: 'Mesero Solicitado 🛎️',
      message: `Solicitud enviada. Un mesero acudirá a la Mesa #${requestDetails.tableNumber || tableNumber || 'actual'} enseguida.`
    });
  };

  // Despacho de solicitud de cuenta con notificación inmediata a caja
  const handleConfirmBill = (billDetails) => {
    sendServiceNotification(billDetails.tableNumber || tableNumber, 'request_bill', billDetails);
    setIsRequestBillOpen(false);
    setActiveToast({
      type: 'bill',
      title: 'Cuenta Solicitada 🧾',
      message: `Hemos notificado a caja. En breve te llevarán la cuenta a la Mesa #${billDetails.tableNumber || tableNumber || 'actual'} con la terminal o cambio correspondiente.`
    });
  };

  return (
    <div className="min-h-screen bg-charcoal text-warmCream selection:bg-flameOrange selection:text-white flex flex-col justify-between">
      <div>
        {/* Encabezado fijo con detección de mesa y acceso a comanda activa */}
        <Header
          orderMode={orderType}
          setOrderMode={setOrderType}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setIsCartOpen(true)}
          tableNumber={tableNumber}
          isTableLocked={isTableLocked}
          activeOrder={activeConfirmedOrder}
          onOpenActiveTicket={() => setIsSuccessModalOpen(true)}
        />

        {/* Hero visual compacto */}
        <Hero />

        {/* Barra pegajosa con filtro de categorías deslizables */}
        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Cuadrícula del catálogo con espacio suficiente para las botoneras flotantes */}
        <main className="max-w-7xl mx-auto px-4 py-8 pb-36 md:pb-16">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-warmCream tracking-tight">
                  {CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Platillos'}
                </h2>
                {tableNumber && (
                  <span className="px-2.5 py-0.5 rounded-full bg-flameOrange/15 border border-flameOrange/30 text-flameOrange text-xs font-bold">
                    📍 Atendiendo Mesa #{tableNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-warmMuted mt-0.5">
                Platillos preparados a la brasa y fuego indirecto con leña de encino y mezquite.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {activeConfirmedOrder && (
                <button
                  type="button"
                  onClick={() => setIsSuccessModalOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-badgeGold/10 border border-badgeGold/30 text-badgeGold text-xs font-bold hover:bg-badgeGold/20 transition-all cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Comanda {activeConfirmedOrder.folio} en Cocina</span>
                </button>
              )}

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-charcoalCard border border-charcoalBorder text-warmMuted">
                {filteredDishes.length} platillos en esta categoría
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onAddToCart={handleDirectAddToCart}
                onCustomize={handleOpenCustomize}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Modal de personalización de platillo */}
      <CustomizationModal
        isOpen={Boolean(selectedDishForCustomization)}
        dish={selectedDishForCustomization}
        onClose={handleCloseCustomize}
        onConfirm={handleConfirmCustomization}
      />

      {/* Carrito lateral deslizable (Drawer) con soporte de confirmación in-app para mesa */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        orderType={orderType}
        setOrderType={setOrderType}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        isTableLocked={isTableLocked}
        onConfirmInAppOrder={handleConfirmInAppOrder}
      />

      {/* Botonera Flotante de Asistencia en Sala (Llamar Mesero / Pedir Cuenta) */}
      <TableServiceBar
        isVisible={orderType === 'mesa' || Boolean(tableNumber)}
        tableNumber={tableNumber}
        onCallWaiter={() => setIsCallWaiterOpen(true)}
        onRequestBill={() => setIsRequestBillOpen(true)}
        hasBottomCart={cartCount > 0 || Boolean(activeConfirmedOrder)}
        cooldownSeconds={waiterCooldown}
      />

      {/* Barra flotante inferior fija en móvil (para ver orden actual o comanda activa) */}
      <MobileBottomCart
        cart={cart}
        totalItems={cartCount}
        totalAmount={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrder={activeConfirmedOrder}
        onOpenActiveTicket={() => setIsSuccessModalOpen(true)}
      />

      {/* Modal interactivo para Llamar al Mesero con selección de motivo */}
      <CallWaiterModal
        isOpen={isCallWaiterOpen}
        tableNumber={tableNumber}
        onClose={() => setIsCallWaiterOpen(false)}
        onConfirmCall={handleConfirmCallWaiter}
        cooldownSeconds={waiterCooldown}
      />

      {/* Modal interactivo para Pedir la Cuenta con selección de método de pago y propina */}
      <RequestBillModal
        isOpen={isRequestBillOpen}
        tableNumber={tableNumber}
        activeOrder={activeConfirmedOrder}
        cartTotal={cartTotal}
        onClose={() => setIsRequestBillOpen(false)}
        onConfirmBill={handleConfirmBill}
      />

      {/* Notificación Toast Inmediata en pantalla */}
      <ToastNotification
        toast={activeToast}
        onClose={() => setActiveToast(null)}
      />

      {/* Modal / Ticket Digital de Éxito In-App (Comanda Recibida en Cocina) */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        order={activeConfirmedOrder}
        onClose={() => setIsSuccessModalOpen(false)}
        onNewRound={() => setIsSuccessModalOpen(false)}
      />

      {/* Botón flotante en Desktop para consultar ticket activo */}
      {activeConfirmedOrder && (
        <div className="hidden md:flex fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5">
          <button
            type="button"
            onClick={() => setIsSuccessModalOpen(true)}
            className="bg-charcoalCard/95 hover:bg-[#252525] border border-badgeGold/50 text-warmCream px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <span className="p-2 rounded-xl bg-badgeGold/15 text-badgeGold">
              <Receipt className="w-5 h-5" />
            </span>
            <div className="text-left">
              <span className="text-xs font-bold text-warmCream block">
                Mesa #{activeConfirmedOrder.tableNumber} • Comanda en Cocina
              </span>
              <span className="text-[11px] text-badgeGold font-mono font-semibold">
                {activeConfirmedOrder.folio} • Ver Ticket
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Pie de página con datos de contacto y sello de autoridad */}
      <Footer />
    </div>
  );
}
