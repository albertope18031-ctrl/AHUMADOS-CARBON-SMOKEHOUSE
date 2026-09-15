import React, { useState, useEffect } from 'react';
import { Wifi, Copy, Check, X, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function WifiModal({ isOpen, onClose, onCopied }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const wifiInfo = RESTAURANT_INFO.wifi || {
    network: 'AhumadosCarbon_Guest',
    password: 'humoybrasa2024'
  };

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(wifiInfo.password);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = wifiInfo.password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      if (onCopied) {
        onCopied();
      }
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error('Error al copiar contraseña:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wifi-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-5 text-white shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 select-none">
        {/* Botón de cierre */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 p-1.5 rounded-full border border-neutral-700 transition-colors cursor-pointer"
          aria-label="Cerrar modal de Wi-Fi"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Wifi className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 id="wifi-modal-title" className="text-base font-bold text-white">
              Wi-Fi de Cortesía
            </h3>
            <span className="text-[11px] text-neutral-400">
              Conexión de alta velocidad para clientes
            </span>
          </div>
        </div>

        {/* Datos de la Red */}
        <div className="space-y-3 bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              Nombre de Red (SSID)
            </span>
            <span className="text-sm font-bold text-amber-400 font-mono">
              {wifiInfo.network}
            </span>
          </div>

          <div className="pt-2 border-t border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              Contraseña
            </span>
            <span className="text-base font-bold text-white font-mono tracking-wider">
              {wifiInfo.password}
            </span>
          </div>
        </div>

        {/* Botón directo de copiado */}
        <button
          type="button"
          onClick={handleCopy}
          className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-900/40'
              : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>¡Contraseña copiada al portapapeles!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar contraseña</span>
            </>
          )}
        </button>

        {/* Nota de seguridad */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Red protegida para comensales en sala</span>
        </div>
      </div>
    </div>
  );
}
