import React from 'react';
import { Flame, Beef, Sandwich, UtensilsCrossed, Beer } from 'lucide-react';
import { CATEGORIES } from '../data/menuData';

// Mapeo dinámico de íconos de Lucide React
const ICON_MAP = {
  Flame,
  Beef,
  Sandwich,
  UtensilsCrossed,
  Beer
};

export default function CategoryFilter({
  categories = CATEGORIES,
  activeCategory,
  onSelectCategory
}) {
  return (
    <nav 
      aria-label="Filtro de categorías de menú"
      className="overflow-x-auto no-scrollbar py-3 sticky top-[118px] md:top-[88px] bg-charcoal/95 backdrop-blur-md z-30 border-b border-charcoalBorder"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2.5 min-w-max">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const IconComponent = ICON_MAP[category.icon];

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? 'bg-flameOrange text-warmCream font-bold shadow-md scale-100'
                  : 'bg-charcoalCard text-warmMuted hover:text-warmCream border border-charcoalBorder hover:border-charcoalBorder/80'
              }`}
            >
              {IconComponent && (
                <IconComponent 
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-warmCream' : 'text-warmMuted'
                  }`} 
                />
              )}
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
