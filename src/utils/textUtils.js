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

/**
 * Sanitiza la entrada del número de mesa eliminando prefijos redundantes
 * como "Mesa", "Table", "#" o espacios extras (ej. "Mesa 4" -> "4", "#12" -> "12").
 */
export const cleanTableNumber = (value) => {
  if (!value) return '';
  return value.toString().replace(/^(mesa|table|#|\s)+/gi, '').trim();
};
