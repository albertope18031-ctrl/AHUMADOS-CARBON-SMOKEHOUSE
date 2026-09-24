import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function Footer() {
  return (
    <footer 
      className="pt-3 pb-24 sm:pb-28 px-4 text-center text-xs text-neutral-500 border-t border-neutral-900/40"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 5.5rem)' }}
    >
      <p>© {new Date().getFullYear()} {RESTAURANT_INFO.name}. Todos los derechos reservados.</p>
    </footer>
  );
}
