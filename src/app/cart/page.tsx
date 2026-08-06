"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, cartKey } from "@/components/cart/CartProvider";
import { formatPrice, buildWhatsAppMessage, whatsappLink } from "@/lib/site";
import { useState } from "react";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [sent, setSent] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold text-novva-white">Tu carrito está vacío</h1>
        <p className="mt-3 text-novva-gray">
          Agrega prendas desde el catálogo y envíanos tu pedido por WhatsApp.
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-block rounded-full bg-novva-purple px-8 py-3.5 text-sm font-bold text-novva-black transition-all hover:bg-novva-pink"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const orderItems = items.map((item) => ({
    name: item.name,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    unitPrice: item.price,
    subtotal: item.price * item.quantity,
  }));
  const message = buildWhatsAppMessage(orderItems, total);
  const link = whatsappLink(message);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-novva-white">Tu carrito</h1>
        <button
          onClick={clearCart}
          className="text-sm text-novva-gray transition-colors hover:text-novva-pink"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const key = cartKey(item);
            return (
              <div
                key={key}
                className="flex gap-4 rounded-2xl border border-novva-white/10 bg-novva-white/[0.03] p-4"
              >
                <Link href={`/product/${item.productId}`} className="relative block h-28 w-22 shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-novva-deeppurple/30 text-2xl font-bold text-novva-purple">
                      N
                    </div>
                  )}
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-novva-white">{item.name}</p>
                      <p className="mt-0.5 text-xs text-novva-gray">
                        {item.size && `Talla ${item.size}`}
                        {item.size && item.color && " · "}
                        {item.color}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(key)}
                      className="text-novva-gray transition-colors hover:text-novva-pink"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-lg border border-novva-white/15">
                      <button
                        onClick={() => updateQuantity(key, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-novva-gray transition-colors hover:text-novva-white"
                        aria-label="Reducir"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(key, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-novva-gray transition-colors hover:text-novva-white"
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-novva-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-novva-white/10 bg-novva-white/[0.03] p-6">
          <h2 className="text-lg font-bold text-novva-white">Resumen del pedido</h2>

          <ul className="mt-4 space-y-2 text-sm text-novva-gray">
            {items.map((item) => {
              const key = cartKey(item);
              return (
                <li key={key} className="flex justify-between gap-2">
                  <span className="truncate">
                    {item.name} × {item.quantity}
                    {item.size && ` (${item.size})`}
                  </span>
                  <span className="shrink-0 text-novva-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-novva-white/10 pt-5">
            <span className="font-semibold text-novva-white">Total</span>
            <span className="text-2xl font-extrabold text-novva-purple">
              {formatPrice(total)}
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-novva-gray">
            Al enviar el pedido, se abrirá WhatsApp con el detalle completo de tu
            compra (productos, tallas, colores, cantidades y total). Nosotros
            confirmamos disponibilidad y envío.
          </p>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setSent(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-novva-purple px-6 py-3.5 text-sm font-bold text-novva-black transition-all hover:bg-novva-pink hover:shadow-[0_0_30px_rgba(255,79,191,0.4)]"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            {sent ? "Pedido enviado ✓" : "Enviar pedido por WhatsApp"}
          </a>

          <Link
            href="/catalog"
            className="mt-3 block text-center text-sm text-novva-gray transition-colors hover:text-novva-purple"
          >
            ← Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
