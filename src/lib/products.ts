import { createServerSupabase } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    category: row.category as string,
    material: row.material as string,
    sizes: (row.sizes as string[]) ?? [],
    colors: (row.colors as string[]) ?? [],
    images: (row.images as string[]) ?? [],
    stock: Number(row.stock),
    featured: Boolean(row.featured),
    created_at: row.created_at as string,
  };
}

const PRODUCT_COLUMNS =
  "id, name, slug, description, price, original_price, category, material, sizes, colors, images, stock, featured, created_at";

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener productos:", error.message);
    return [];
  }

  return (data ?? []).map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener producto:", error.message);
    return null;
  }

  return toProduct(data);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error al obtener destacados:", error.message);
    return [];
  }

  return (data ?? []).map(toProduct);
}

export async function getProductsOnSale(): Promise<Product[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .not("original_price", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener ofertas:", error.message);
    return [];
  }

  return (data ?? []).map(toProduct);
}

export interface ProductFilters {
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "recientes" | "precio-asc" | "precio-desc" | "destacados";
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = await createServerSupabase();
  let query = supabase.from("products").select(PRODUCT_COLUMNS);

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.size) {
    query = query.contains("sizes", [filters.size]);
  }
  if (filters.color) {
    query = query.contains("colors", [filters.color]);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  switch (filters.sort) {
    case "precio-asc":
      query = query.order("price", { ascending: true });
      break;
    case "precio-desc":
      query = query.order("price", { ascending: false });
      break;
    case "destacados":
      query = query.order("featured", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error al filtrar productos:", error.message);
    return [];
  }

  return (data ?? []).map(toProduct);
}

export async function getCategories(): Promise<string[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("category");

  if (error) {
    console.error("Error al obtener categorías:", error.message);
    return [];
  }

  const categories = new Set<string>();
  (data ?? []).forEach((row) => {
    const cat = (row as { category: string }).category;
    if (cat) categories.add(cat);
  });

  return Array.from(categories).sort();
}
