/**
 * Normaliza cadenas de texto eliminando acentos, diacríticos y pasando a minúsculas
 * para búsquedas gastronómicas resilientes (ej. "vacio" encuentra "Vacío", "leña" encuentra "leña").
 */
export function normalizeString(str) {
  if (!str) return '';
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
