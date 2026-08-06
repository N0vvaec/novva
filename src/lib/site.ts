export const site = {
  name: "NOVVA",
  tagline: "Streetwear urbano nocturno",
  description:
    "Ropa de hombre con estilo urbano nocturno, minimalista y exclusivo.",
  // Reemplaza con tu número de WhatsApp en formato internacional sin "+"
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "00000000000",
  // Reemplaza con tus URLs de redes sociales
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/novva",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://tiktok.com/@novva",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://facebook.com/novva",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contacto@novva.com",
  currency: "USD",
  currencySymbol: "$",
} as const;

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: site.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildWhatsAppMessage(
  items: {
    name: string;
    size: string | null;
    color: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[],
  total: number,
): string {
  const lines = items.map((item, index) => {
    const details = [
      item.size ? `Talla: ${item.size}` : null,
      item.color ? `Color: ${item.color}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    return `${index + 1}. ${item.name}${details ? ` (${details})` : ""}\n   Cantidad: ${item.quantity} · Precio: ${formatPrice(item.unitPrice)}\n   Subtotal: ${formatPrice(item.subtotal)}`;
  });

  return encodeURIComponent(
    `Hola ${site.name}! 👋 Quiero hacer el siguiente pedido:\n\n${lines.join("\n\n")}\n\n*TOTAL: ${formatPrice(total)}*\n\n¿Podrían confirmarme disponibilidad y envío?`,
  );
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${message}`;
}
