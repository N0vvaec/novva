"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/site";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [size, setSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null,
  );
  const [color, setColor] = useState<string | null>(
    product.colors.length === 1 ? product.colors[0] : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock === 0;

  function handleAdd() {
    if (!size && product.sizes.length > 0) return;
    if (!color && product.colors.length > 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      color,
      quantity,
      image: product.images[0] ?? "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-3xl font-extrabold text-novva-white">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-novva-gray line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="rounded-full bg-novva-pink px-2.5 py-1 text-xs font-bold text-novva-black">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            outOfStock ? "bg-red-500" : product.stock <= 5 ? "bg-yellow-400" : "bg-green-400"
          }`}
        />
        {outOfStock ? (
          <span className="font-medium text-red-400">Agotado</span>
        ) : (
          <span className="text-novva-gray">
            {product.stock <= 5 ? "¡Quedan pocas unidades!" : "Disponible"} · {product.stock} en stock
          </span>
        )}
      </div>

      {product.material && (
        <div className="text-sm text-novva-gray">
          <span className="font-semibold text-novva-white">Material: </span>
          {product.material}
        </div>
      )}

      {product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-novva-gray">
            Talla {size ? `— ${size}` : "(selecciona)"}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`min-w-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  size === s
                    ? "border-novva-purple bg-novva-purple text-novva-black"
                    : "border-novva-white/15 text-novva-white hover:border-novva-purple/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-novva-gray">
            Color {color ? `— ${color}` : "(selecciona)"}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  color === c
                    ? "border-novva-sky bg-novva-sky text-novva-black"
                    : "border-novva-white/15 text-novva-white hover:border-novva-sky/60"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-novva-white/15">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2.5 text-novva-gray transition-colors hover:text-novva-white"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
            className="px-3 py-2.5 text-novva-gray transition-colors hover:text-novva-white"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className={`flex-1 rounded-full px-6 py-3 text-sm font-bold transition-all ${
            added
              ? "bg-green-500 text-novva-black"
              : outOfStock
                ? "cursor-not-allowed bg-novva-white/10 text-novva-gray"
                : "bg-novva-purple text-novva-black hover:bg-novva-pink hover:shadow-[0_0_30px_rgba(255,79,191,0.4)]"
          }`}
        >
          {added ? "✓ Agregado" : outOfStock ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>

      <Link
        href="/cart"
        className="rounded-full border border-novva-white/20 px-6 py-3 text-center text-sm font-semibold text-novva-white transition-colors hover:border-novva-sky hover:text-novva-sky"
      >
        Ver carrito y pedir por WhatsApp →
      </Link>
    </div>
  );
}
