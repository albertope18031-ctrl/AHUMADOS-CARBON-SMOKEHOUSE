/**
 * Módulo de despacho y persistencia de eventos de servicio en mesa
 */
export const sendServiceNotification = (tableNumber, serviceType, details = {}) => {
  const now = new Date();
  const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const eventData = {
    id: `REQ-${Date.now()}`,
    tableNumber: String(tableNumber || '').trim(),
    serviceType, // 'call_waiter' | 'request_bill'
    details,
    timestamp,
    status: 'pending'
  };

  // 1. Persistencia local para historial o reintentos
  try {
    const stored = JSON.parse(localStorage.getItem('smokehouse_service_requests') || '[]');
    stored.unshift(eventData);
    localStorage.setItem('smokehouse_service_requests', JSON.stringify(stored.slice(0, 25)));
  } catch (err) {
    console.error('Error guardando solicitud de servicio:', err);
  }

  // 2. Disparo de evento desacoplado para WebSockets / Listeners en la app
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('smokehouse:service_request', { detail: eventData })
    );
  }

  return eventData;
};
