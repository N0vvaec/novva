import Link from "next/link";
import { getFeaturedProducts, getProductsOnSale } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { site } from "@/lib/site";

export const revalidate = 300;

export default async function Home() {
  const [featured, onSale] = await Promise.all([
    getFeaturedProducts(),
    getProductsOnSale(),
  ]);

  return (
    <div className="flex flex-col">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 20%, rgba(165,92,255,0.25) 0%, transparent 60%), radial-gradient(50% 40% at 20% 80%, rgba(255,79,191,0.18) 0%, transparent 60%), radial-gradient(40% 40% at 90% 90%, rgba(111,216,255,0.15) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-32">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-novva-sky">
            Streetwear urbano nocturno
          </p>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-novva-white sm:text-7xl">
            NOVVA<span className="text-novva-purple">.</span>
            <span className="block bg-gradient-to-r from-novva-purple via-novva-pink to-novva-sky bg-clip-text text-transparent">
              Viste la noche.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-novva-gray sm:text-lg">
            Ropa de hombre minimalista y exclusiva. {site.tagline} con carácter
            para los que no pasan desapercibidos.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalog"
              className="rounded-full bg-novva-purple px-8 py-3.5 text-sm font-bold text-novva-black transition-all hover:bg-novva-pink hover:shadow-[0_0_30px_rgba(255,79,191,0.4)]"
            >
              Explorar catálogo
            </Link>
            <Link
              href="/catalog?sort=destacados"
              className="rounded-full border border-novva-white/20 px-8 py-3.5 text-sm font-semibold text-novva-white transition-colors hover:border-novva-purple hover:text-novva-purple"
            >
              Ver ofertas
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Destacados ===== */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-novva-white sm:text-3xl">
              Destacados
            </h2>
            <p className="mt-1 text-sm text-novva-gray">
              Las prendas favoritas de esta temporada
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold text-novva-purple transition-colors hover:text-novva-pink"
          >
            Ver todo →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-novva-gray">
            Aún no hay productos destacados.
          </p>
        )}
      </section>

      {/* ===== Ofertas ===== */}
      {onSale.length > 0 && (
        <section className="border-y border-novva-white/10 bg-novva-white/[0.02] py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="mb-2 inline-block rounded-full bg-novva-pink/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-novva-pink">
                  Ofertas
                </span>
                <h2 className="text-2xl font-bold text-novva-white sm:text-3xl">
                  Descuentos activos
                </h2>
              </div>
              <Link
                href="/catalog?sort=destacados"
                className="text-sm font-semibold text-novva-pink transition-colors hover:text-novva-white"
              >
                Ver ofertas →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {onSale.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA WhatsApp ===== */}
      <section className="relative overflow-hidden py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(165,92,255,0.15), transparent 50%), radial-gradient(50% 60% at 50% 100%, rgba(94,75,139,0.4), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-novva-white sm:text-4xl">
            ¿Listo para tu próxima prenda?
          </h2>
          <p className="mt-4 text-novva-gray">
            Haz tu pedido directo por WhatsApp. Te respondemos al instante.
          </p>
          <a
            href={`https://wa.me/${site.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-novva-purple px-8 py-3.5 text-sm font-bold text-novva-black transition-all hover:bg-novva-pink hover:shadow-[0_0_30px_rgba(255,79,191,0.4)]"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Pedir por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
