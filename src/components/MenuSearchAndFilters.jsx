import React, { useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { QUICK_FILTERS } from '../data/menuData';

export default function MenuSearchAndFilters({
  searchQuery = '',
  onSearchChange,
  selectedFilters = [],
  onToggleFilter,
  onClearAll,
  totalResults = 0,
  isFiltering = false
}) {
  const [localInput, setLocalInput] = useState(searchQuery);
  const inputRef = useRef(null);

  // Sincronizar el input interno si el padre limpia la búsqueda externamente
  useEffect(() => {
    setLocalInput(searchQuery);
  }, [searchQuery]);

  // Debounce de 250ms para garantizar fluidez absoluta al teclear
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localInput !== searchQuery) {
        onSearchChange(localInput);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [localInput, searchQuery, onSearchChange]);

  const handleClearInput = () => {
    setLocalInput('');
    onSearchChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <section 
      aria-label="Búsqueda y filtros rápidos" 
      className="max-w-7xl mx-auto px-4 pt-2.5 pb-1 sm:pt-3.5 sm:pb-2"
    >
      {/* 1. Barra de Búsqueda en Tiempo Real */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-warmMuted pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4 text-warmMuted/80" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          placeholder="Buscar platillo, corte, ingrediente o bebida..."
          className="w-full h-10 sm:h-11 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 focus:border-flameOrange focus:ring-1 focus:ring-flameOrange/40 rounded-xl pl-10 pr-10 text-sm text-warmCream placeholder:text-warmMuted/50 transition-all outline-none"
        />

        {localInput && (
          <button
            type="button"
            onClick={handleClearInput}
            aria-label="Borrar búsqueda"
            className="absolute right-3 p-1 rounded-lg text-warmMuted hover:text-warmCream hover:bg-charcoalBorder/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Chips Deslizables de Filtros Rápidos (Dietary & Preferences) */}
      <div className="mt-2 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 text-xs text-warmMuted flex-shrink-0 mr-1 select-none">
          <SlidersHorizontal className="w-3.5 h-3.5 text-flameOrange" />
          <span className="hidden xs:inline font-semibold">Filtros:</span>
        </div>

        {QUICK_FILTERS.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id);

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onToggleFilter(filter.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap flex-shrink-0 ${
                isSelected
                  ? 'bg-flameOrange text-warmCream font-bold shadow-md shadow-flameOrange/25 border border-flameOrange scale-[1.02]'
                  : 'bg-charcoalCard text-warmCream/80 hover:text-warmCream border border-charcoalBorder hover:border-charcoalBorder/90'
              }`}
            >
              <span className="text-sm">{filter.icon}</span>
              <span>{filter.label}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-warmCream ml-0.5 animate-pulse" />
              )}
            </button>
          );
        })}

        {/* Botón rápido para limpiar filtros activos si hay alguno seleccionado */}
        {selectedFilters.length > 0 && (
          <button
            type="button"
            onClick={() => onClearAll()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-warmMuted hover:text-flameOrange transition-colors flex-shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      {/* 3. Barra Informativa de Resultados (cuando hay búsqueda o filtro activo) */}
      {isFiltering && (
        <div className="mt-3 p-3 bg-charcoalCard/90 border border-charcoalBorder rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-flameOrange animate-ping" />
            <span className="text-warmCream font-medium">
              Mostrando <strong className="text-flameOrange font-bold">{totalResults}</strong>{' '}
              {totalResults === 1 ? 'platillo' : 'platillos'}
              {searchQuery.trim() && (
                <span>
                  {' '}para &ldquo;<span className="text-warmCream font-semibold">{searchQuery}</span>&rdquo;
                </span>
              )}
              {selectedFilters.length > 0 && (
                <span className="text-warmMuted">
                  {' '}con {selectedFilters.length}{' '}
                  {selectedFilters.length === 1 ? 'filtro activo' : 'filtros activos'}
                </span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-bold text-flameOrange hover:text-flameOrangeHover underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      )}
    </section>
  );
}
