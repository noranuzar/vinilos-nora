// Enlace base de WhatsApp. El mensaje completo del pedido se construye en el paso 5.
export function enlaceWhatsApp(numero, texto = '') {
  const base = `https://wa.me/${numero}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}
