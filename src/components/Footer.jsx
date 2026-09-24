import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function Footer() {
  return (
    <footer className="py-6 px-4 text-center text-xs text-neutral-500 border-t border-neutral-900/80 mb-20 sm:mb-24">
      <p>© {new Date().getFullYear()} {RESTAURANT_INFO.name}. Todos los derechos reservados.</p>
    </footer>
  );
}
