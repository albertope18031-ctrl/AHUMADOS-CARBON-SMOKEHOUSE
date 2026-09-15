import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import DishCard from './components/DishCard';
import CustomizationModal from './components/CustomizationModal';
import CartDrawer from './components/CartDrawer';
import UnifiedBottomBar from './components/UnifiedBottomBar';
import OrderSuccessModal from './components/OrderSuccessModal';
import CallWaiterModal from './components/CallWaiterModal';
import RequestBillModal from './components/RequestBillModal';
import ToastNotification from './components/ToastNotification';
import Footer from './components/Footer';
import MenuSearchAndFilters from './components/MenuSearchAndFilters';
import InvoiceModal from './components/InvoiceModal';
import { Receipt, Flame, RotateCcw } from 'lucide-react';
import { CATEGORIES, DISHES } from './data/menuData';
import { sendServiceNotification } from './utils/serviceNotifications';
import { normalizeString, cleanTableNumber } from './utils/textUtils';

export default function App() {
  // 1. Detección automática de mesa vía URL (?mesa=4 o ?table=4) o localStorage
  const [tableNumber, setTableNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramTable = params.get('mesa') || params.get('table');
      if (paramTable) {
        const cleaned = cleanTableNumber(paramTable);
        try {
          localStorage.setItem('smokehouse_table', cleaned);
        } catch (e) {}
        return cleaned;
      }
      try {
        const saved = localStorage.getItem('smokehouse_table');
        return saved ? cleanTableNumber(saved) : '';
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
  const [orderType, setOrderType] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mesa') || params.get('table')) {
        return 'mesa';
      }
    }
    return 'mesa';
  });

  // 1.1 Lectura y verificación automática de mesa vía Código QR al cargar la página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramTable = params.get('mesa') || params.get('table');
      if (paramTable) {
        const cleaned = cleanTableNumber(paramTable);
        setTableNumber(cleaned);
        setIsTableLocked(true);
        setOrderType('mesa');
        try {
          localStorage.setItem('smokehouse_table', cleaned);
        } catch (e) {}
      }
    }
  }, []);

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
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // 3. Módulo de Asistencia en Sala (Llamar mesero / Pedir cuenta / Toasts / Cooldown)
  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const [isRequestBillOpen, setIsRequestBillOpen] = useState(false);
  const [waiterCooldown, setWaiterCooldown] = useState(0);
  const [activeToast, setActiveToast] = useState(null);

  // 3. Manejador de cambio de modalidad con cierre automático de modales de salón
  const handleOrderTypeChange = (newMode) => {
    setOrderType(newMode);
    if (newMode === 'llevar') {
      setIsCallWaiterOpen(false);
      setIsRequestBillOpen(false);
    }
  };

  // Cierre preventivo de modales de salón al cambiar a modalidad 'llevar'
  useEffect(() => {
    if (orderType === 'llevar') {
      setIsCallWaiterOpen(false);
      setIsRequestBillOpen(false);
    }
  }, [orderType]);

  // Temporizador de bloqueo (cooldown de 75 segundos)
  useEffect(() => {
    if (waiterCooldown <= 0) return;
    const interval = setInterval(() => {
      setWaiterCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [waiterCooldown]);

  // Totales de la orden activa en carrito
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Estados de búsqueda en tiempo real y chips de filtros rápidos
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleToggleFilter = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedFilters([]);
  };

  const isFiltering = searchQuery.trim().length > 0 || selectedFilters.length > 0;
  const normalizedQuery = normalizeString(searchQuery);

  // Filtrado de platillos según categoría activa o búsqueda global + filtros rápidos
  const filteredDishes = DISHES.filter((dish) => {
    // Si no hay filtro ni búsqueda activa, filtrar por categoría activa
    if (!isFiltering) {
      return dish.categoryId === activeCategory;
    }

    // 1. Validar filtros rápidos seleccionados (todos los seleccionados deben coincidir)
    const matchesQuickFilters = selectedFilters.every((filterId) => {
      if (filterId === 'especialidad') {
        return Boolean(dish.isSpecialty || dish.tags?.includes('especialidad'));
      }
      if (filterId === 'para-compartir') {
        return Boolean(dish.tags?.includes('para-compartir'));
      }
      if (filterId === 'picante') {
        return Boolean(dish.tags?.includes('picante'));
      }
      if (filterId === 'sin-gluten') {
        return Boolean(dish.tags?.includes('sin-gluten'));
      }
      if (filterId === 'ligero') {
        return Boolean(dish.tags?.includes('ligero') || dish.tags?.includes('vegetariano'));
      }
      return Boolean(dish.tags?.includes(filterId));
    });

    if (!matchesQuickFilters) return false;

    // 2. Si no hay texto de búsqueda escrito, basta con que cumpla los quick filters
    if (!normalizedQuery) return true;

    // 3. Validar coincidencia de texto en nombre, descripción, tags, badge y categoría
    const nameNorm = normalizeString(dish.name);
    const descNorm = normalizeString(dish.description);
    const badgeNorm = normalizeString(dish.badge || '');
    const tagsNorm = (dish.tags || []).map(normalizeString);
    const categoryObj = CATEGORIES.find((c) => c.id === dish.categoryId);
    const categoryNorm = categoryObj ? normalizeString(categoryObj.name) : '';

    return (
      nameNorm.includes(normalizedQuery) ||
      descNorm.includes(normalizedQuery) ||
      badgeNorm.includes(normalizedQuery) ||
      categoryNorm.includes(normalizedQuery) ||
      tagsNorm.some((tag) => tag.includes(normalizedQuery))
    );
  });

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
          setOrderMode={handleOrderTypeChange}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setIsCartOpen(true)}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          isTableLocked={isTableLocked}
          activeOrder={activeConfirmedOrder}
          onOpenActiveTicket={() => setIsSuccessModalOpen(true)}
        />

        {/* Hero visual compacto */}
        <Hero />

        {/* Barra de búsqueda en tiempo real y chips deslizables de filtros rápidos */}
        <MenuSearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilters={selectedFilters}
          onToggleFilter={handleToggleFilter}
          onClearAll={handleClearAllFilters}
          totalResults={filteredDishes.length}
          isFiltering={isFiltering}
        />

        {/* Barra pegajosa con filtro de categorías deslizables */}
        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={(categoryId) => {
            setActiveCategory(categoryId);
            // Si hay filtros o búsqueda activa y el comensal toca una categoría, limpiamos para mostrar la categoría elegida
            if (isFiltering) {
              handleClearAllFilters();
            }
          }}
        />

        {/* Cuadrícula del catálogo o estado vacío con compensación ergonómica fija inferior */}
        <main 
          className="max-w-7xl mx-auto px-4 py-6 sm:py-8 pb-28 sm:pb-32"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 7.5rem)' }}
        >
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-warmCream tracking-tight">
                  {isFiltering ? 'Platillos Encontrados' : (CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Platillos')}
                </h2>
                {orderType === 'mesa' && cleanTableNumber(tableNumber) && (
                  <span className="px-2.5 py-0.5 rounded-full bg-flameOrange/15 border border-flameOrange/30 text-flameOrange text-xs font-bold animate-in fade-in">
                    📍 Mesa {cleanTableNumber(tableNumber)}
                  </span>
                )}
              </div>
              <p className="text-xs text-warmMuted mt-0.5">
                {isFiltering
                  ? 'Búsqueda global en toda la carta por cortes, ingredientes y preferencias.'
                  : 'Platillos preparados a la brasa y fuego indirecto con leña de encino y mezquite.'}
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
                {filteredDishes.length} {filteredDishes.length === 1 ? 'platillo' : 'platillos'}
                {isFiltering ? ' encontrados' : ' en esta categoría'}
              </span>
            </div>
          </div>

          {filteredDishes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onAddToCart={handleDirectAddToCart}
                  onCustomize={handleOpenCustomize}
                  categoryName={isFiltering ? CATEGORIES.find((c) => c.id === dish.categoryId)?.name : null}
                />
              ))}
            </div>
          ) : (
            /* Estado Vacío Gastronómico */
            <div className="py-14 sm:py-20 px-6 text-center max-w-lg mx-auto flex flex-col items-center bg-charcoalCard/50 border border-charcoalBorder rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-flameOrange/10 border border-flameOrange/25 flex items-center justify-center mb-5 text-flameOrange shadow-inner">
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce text-flameOrange" />
              </div>

              <h3 className="text-lg sm:text-xl font-black text-warmCream mb-2 tracking-tight">
                No encontramos platillos para tu búsqueda
              </h3>

              <p className="text-xs sm:text-sm text-warmCream/70 leading-relaxed mb-6">
                No encontramos coincidencias para{' '}
                {searchQuery.trim() ? (
                  <span className="text-flameOrange font-bold">&ldquo;{searchQuery}&rdquo;</span>
                ) : (
                  'los filtros seleccionados'
                )}
                .{' '}
                Prueba buscando términos como <span className="text-warmCream font-semibold">&ldquo;brisket&rdquo;</span>, <span className="text-warmCream font-semibold">&ldquo;costillas&rdquo;</span>, <span className="text-warmCream font-semibold">&ldquo;papas&rdquo;</span>, <span className="text-warmCream font-semibold">&ldquo;burger&rdquo;</span> o restablece los filtros activos.
              </p>

              <button
                type="button"
                onClick={handleClearAllFilters}
                className="bg-flameOrange hover:bg-flameOrangeHover text-warmCream font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-flameOrange/25 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ver Menú Completo</span>
              </button>
            </div>
          )}
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
        setOrderType={handleOrderTypeChange}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        isTableLocked={isTableLocked}
        onConfirmInAppOrder={handleConfirmInAppOrder}
        onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
      />

      {/* Barra inferior fija única y ergonómica (asistencia en mesa + botón principal de orden) */}
      <UnifiedBottomBar
        orderType={orderType}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onCallWaiter={() => setIsCallWaiterOpen(true)}
        onRequestBill={() => setIsRequestBillOpen(true)}
        cooldownSeconds={waiterCooldown}
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

      {/* Modal de Solicitud de Factura Electrónica (CFDI 4.0) */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
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

      {/* Pie de página con datos de contacto, enlaces interactivos y sello de autoridad */}
      <Footer onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)} />
    </div>
  );
}
