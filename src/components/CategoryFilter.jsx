import React from 'react';
import { Flame, Beef, Sandwich, UtensilsCrossed, Beer, CakeSlice } from 'lucide-react';
import { CATEGORIES } from '../data/menuData';

// Mapeo dinámico de íconos de Lucide React
const ICON_MAP = {
  Flame,
  Beef,
  Sandwich,
  UtensilsCrossed,
  Beer,
  CakeSlice
};

export default function CategoryFilter({
  categories = CATEGORIES,
  activeCategory,
  onSelectCategory
}) {
  return (
    <nav 
      aria-label="Filtro de categorías de menú"
      className="overflow-x-auto no-scrollbar py-2 sm:py-2.5 sticky top-[116px] md:top-[90px] bg-neutral-950/95 backdrop-blur-md z-30 border-b border-neutral-800 shadow-md transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 min-w-max">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const IconComponent = ICON_MAP[category.icon];

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(category.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer select-none font-bold ${
                isActive
                  ? 'bg-flameOrange text-warmCream shadow-md shadow-flameOrange/25 border border-flameOrange/80 scale-[1.02]'
                  : 'bg-neutral-900 text-neutral-400 hover:text-warmCream border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {IconComponent && (
                <IconComponent 
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-warmCream' : 'text-neutral-400'
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
