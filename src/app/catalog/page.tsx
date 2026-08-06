import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/catalog/FilterBar";

export const metadata: Metadata = {
  title: "Catálogo — NOVVA",
  description: "Explora el catálogo completo de NOVVA con filtros por categoría, talla, color y precio.",
};

export const revalidate = 300;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    size?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const sort = (["recientes", "precio-asc", "precio-desc", "destacados"] as const).includes(
    params.sort as never,
  )
    ? (params.sort as "recientes" | "precio-asc" | "precio-desc" | "destacados")
    : "recientes";

  const [products, categories] = await Promise.all([
    getProducts({
      category: params.category,
      size: params.size,
      color: params.color,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      search: params.search,
      sort,
    }),
    getCategories(),
  ]);

  const activeFilterCount = [
    params.category,
    params.size,
    params.color,
    params.minPrice,
    params.maxPrice,
    params.search,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-novva-white sm:text-4xl">
          Catálogo
        </h1>
        <p className="mt-2 text-novva-gray">
          {products.length} producto{products.length !== 1 ? "s" : ""}
          {activeFilterCount > 0 && (
            <span className="text-novva-purple"> · {activeFilterCount} filtro{activeFilterCount !== 1 ? "s" : ""} activo{activeFilterCount !== 1 ? "s" : ""}</span>
          )}
        </p>
      </div>

      <FilterBar categories={categories} />

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-novva-white/10 py-16 text-center">
          <p className="text-novva-gray">No encontramos productos con esos filtros.</p>
          <a
            href="/catalog"
            className="mt-4 inline-block text-sm font-semibold text-novva-purple hover:text-novva-pink"
          >
            Limpiar filtros
          </a>
        </div>
      )}
    </div>
  );
}
