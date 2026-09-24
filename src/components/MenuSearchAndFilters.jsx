import React, { useState, useEffect, useRef } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

export default function MenuSearchAndFilters({
  searchQuery = '',
  onSearchChange,
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
    if (onClearAll) onClearAll();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <section 
      aria-label="Búsqueda en el menú" 
      className="max-w-7xl mx-auto px-4 pt-2.5 pb-1 sm:pt-3 sm:pb-1.5"
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

      {/* 2. Barra Informativa de Resultados (cuando hay búsqueda activa) */}
      {isFiltering && (
        <div className="mt-2.5 p-3 bg-charcoalCard/90 border border-charcoalBorder rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm animate-in fade-in duration-200">
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
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearInput}
            className="text-xs font-bold text-flameOrange hover:text-flameOrangeHover underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar búsqueda</span>
          </button>
        </div>
      )}
    </section>
  );
}
