import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import DishCard from './components/DishCard';
import CustomizationModal from './components/CustomizationModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { CATEGORIES, DISHES } from './data/menuData';

export default function App() {
  // Estados centralizados de la aplicación
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('mesa');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]?.id || 'ahumados');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDishForCustomization, setSelectedDishForCustomization] = useState(null);

  // Filtrado de platillos según categoría activa
  const filteredDishes = DISHES.filter((dish) => dish.categoryId === activeCategory);

  // Totales de la orden
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

  // Agregar platillo directo (sin opciones o simple)
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

  return (
    <div className="min-h-screen bg-charcoal text-warmCream selection:bg-flameOrange selection:text-white flex flex-col justify-between">
      <div>
        {/* Encabezado fijo con selector de modo y botón de orden */}
        <Header
          orderMode={orderType}
          setOrderMode={setOrderType}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Hero visual compacto */}
        <Hero />

        {/* Barra pegajosa con filtro de categorías deslizables */}
        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Cuadrícula del catálogo de platillos */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-warmCream tracking-tight">
                {CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Platillos'}
              </h2>
              <p className="text-xs text-warmMuted mt-0.5">
                Platillos preparados a la brasa y fuego indirecto con leña de encino y mezquite.
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-charcoalCard border border-charcoalBorder text-warmMuted">
              {filteredDishes.length} platillos en esta categoría
            </span>
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

      {/* Carrito deslizante (Drawer) con validación y despacho a WhatsApp */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        orderType={orderType}
        setOrderType={setOrderType}
      />

      {/* Pie de página con datos de contacto y sello de autoridad */}
      <Footer />
    </div>
  );
}
