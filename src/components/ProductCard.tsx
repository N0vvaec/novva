import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/site";

function discountPercent(product: Product): number | null {
  if (!product.originalPrice || product.originalPrice <= product.price) return null;
  return Math.round((1 - product.price / product.originalPrice) * 100);
}

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product);
  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-novva-white/10 bg-novva-white/[0.03] transition-all hover:-translate-y-1 hover:border-novva-purple/60 hover:shadow-[0_0_30px_rgba(165,92,255,0.15)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-novva-white/5">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-novva-deeppurple/40 to-novva-black text-novva-purple">
            <span className="text-4xl font-extrabold tracking-widest">N</span>
          </div>
        )}

        {discount !== null && (
          <span className="absolute left-3 top-3 rounded-full bg-novva-pink px-2.5 py-1 text-xs font-bold text-novva-black">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-novva-black/80 px-2.5 py-1 text-xs font-semibold text-novva-white">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-novva-gray">
          {product.category}
        </p>
        <h3 className="font-semibold text-novva-white transition-colors group-hover:text-novva-purple">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold text-novva-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-novva-gray line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
