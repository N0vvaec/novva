"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseNumber(value: FormDataEntryValue | null): number | null {
  if (!value || String(value).trim() === "") return null;
  const n = Number(String(value));
  return Number.isFinite(n) ? n : null;
}

async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;
  return supabase;
}

async function uploadImages(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  files: File[],
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (!file.type.startsWith("image/")) continue;

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type });

    if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`);

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

async function deleteStoredImages(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  urls: string[],
): Promise<void> {
  const paths = urls
    .map((url) => {
      const idx = url.indexOf("/product-images/");
      return idx >= 0 ? url.slice(idx + "/product-images/".length) : null;
    })
    .filter(Boolean) as string[];
  if (paths.length > 0) {
    await supabase.storage.from("product-images").remove(paths);
  }
}

export async function createProduct(formData: FormData) {
  const supabase = await requireAdmin();
  if (!supabase) redirect("/admin/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "El nombre es obligatorio." };

  const price = parseNumber(formData.get("price"));
  if (price === null) return { error: "El precio es obligatorio." };

  const files = Array.from(formData.getAll("images")) as File[];
  const newImages = await uploadImages(supabase, files);
  const existingImages = parseList(String(formData.get("existingImages") ?? ""));

  let slug = slugify(name);
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("products").insert({
    name,
    slug,
    description: String(formData.get("description") ?? ""),
    price,
    original_price: parseNumber(formData.get("originalPrice")),
    category: String(formData.get("category") ?? "Polos").trim() || "Polos",
    material: String(formData.get("material") ?? ""),
    sizes: parseList(String(formData.get("sizes") ?? "")),
    colors: parseList(String(formData.get("colors") ?? "")),
    images: [...existingImages, ...newImages],
    stock: parseNumber(formData.get("stock")) ?? 0,
    featured: formData.get("featured") === "on",
  });

  if (error) return { error: `No se pudo crear el producto: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  if (!supabase) redirect("/admin/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "El nombre es obligatorio." };

  const price = parseNumber(formData.get("price"));
  if (price === null) return { error: "El precio es obligatorio." };

  const files = Array.from(formData.getAll("images")) as File[];
  const newImages = await uploadImages(supabase, files);
  const existingImages = parseList(String(formData.get("existingImages") ?? ""));

  const { data: product } = await supabase
    .from("products")
    .select("images, slug")
    .eq("id", id)
    .single();

  const removedImages = (product?.images ?? []).filter(
    (url: string) => !existingImages.includes(url),
  );

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug: String(formData.get("slug") ?? product?.slug ?? slugify(name)),
      description: String(formData.get("description") ?? ""),
      price,
      original_price: parseNumber(formData.get("originalPrice")),
      category: String(formData.get("category") ?? "Polos").trim() || "Polos",
      material: String(formData.get("material") ?? ""),
      sizes: parseList(String(formData.get("sizes") ?? "")),
      colors: parseList(String(formData.get("colors") ?? "")),
      images: [...existingImages, ...newImages],
      stock: parseNumber(formData.get("stock")) ?? 0,
      featured: formData.get("featured") === "on",
    })
    .eq("id", id);

  if (error) return { error: `No se pudo actualizar: ${error.message}` };

  if (removedImages.length > 0) await deleteStoredImages(supabase, removedImages);

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/product/[id]", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) redirect("/admin/login");

  const { data: product } = await supabase
    .from("products")
    .select("images")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(`No se pudo eliminar: ${error.message}`);

  if (product?.images?.length) await deleteStoredImages(supabase, product.images);

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin");
}

export async function logout() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
