import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, getProducts } from "@/lib/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Producto no encontrado — NOVVA" };
  return {
    title: `${product.name} — NOVVA`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const related = (await getProducts({ category: product.category })).filter(
    (p) => p.id !== product.id,
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-novva-gray">
        <Link href="/" className="transition-colors hover:text-novva-purple">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="transition-colors hover:text-novva-purple">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-novva-white">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-widest text-novva-gray">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-novva-white sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6">
            <AddToCartForm product={product} />
          </div>

          <div className="mt-8 border-t border-novva-white/10 pt-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-novva-white">
              Descripción
            </h2>
            <p className="mt-3 leading-relaxed text-novva-gray">{product.description}</p>
          </div>

          {product.material && (
            <div className="mt-4 text-sm text-novva-gray">
              <span className="font-semibold text-novva-white">Composición: </span>
              {product.material}
            </div>
          )}
          <div className="mt-2 text-sm text-novva-gray">
            <span className="font-semibold text-novva-white">Precio: </span>
            {formatPrice(product.price)}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-bold text-novva-white">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
