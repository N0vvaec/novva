"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface ProductFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | undefined>;
  product?: Product;
}

const CATEGORIES = ["Polos", "Camisetas", "Hoodies", "Pantalones", "Chaquetas", "Accesorios"];

export function ProductForm({ action, product }: ProductFormProps) {
  const [existing, setExisting] = useState<string[]>(product?.images ?? []);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-novva-white/15 bg-novva-black px-4 py-2.5 text-sm text-novva-white outline-none transition-colors focus:border-novva-purple";
  const labelClass = "flex flex-col gap-1 text-xs font-medium text-novva-gray";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    formData.set("existingImages", existing.join(","));
    const result = await action(formData);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="rounded-xl bg-novva-pink/10 px-4 py-3 text-sm text-novva-pink">{error}</p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Nombre *
          <input name="name" required defaultValue={product?.name} className={inputClass} placeholder="Hoodie NOVVA Midnight" />
        </label>

        <label className={labelClass}>
          Categoría
          <select name="category" defaultValue={product?.category ?? "Polos"} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Precio (USD) *
          <input name="price" type="number" step="0.01" min="0" required defaultValue={product?.price ?? ""} className={inputClass} placeholder="29.99" />
        </label>

        <label className={labelClass}>
          Precio original (para ofertas)
          <input name="originalPrice" type="number" step="0.01" min="0" defaultValue={product?.originalPrice ?? ""} className={inputClass} placeholder="39.99 (vacío = sin oferta)" />
        </label>

        <label className={labelClass}>
          Material
          <input name="material" defaultValue={product?.material ?? ""} className={inputClass} placeholder="Algodón 100%" />
        </label>

        <label className={labelClass}>
          Stock *
          <input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} className={inputClass} />
        </label>

        <label className={labelClass}>
          Tallas (separadas por coma)
          <input name="sizes" defaultValue={(product?.sizes ?? []).join(", ")} className={inputClass} placeholder="S, M, L, XL" />
        </label>

        <label className={labelClass}>
          Colores (separados por coma)
          <input name="colors" defaultValue={(product?.colors ?? []).join(", ")} className={inputClass} placeholder="Negro, Blanco, Morado" />
        </label>
      </div>

      <label className={labelClass}>
        Descripción
        <textarea name="description" rows={4} defaultValue={product?.description ?? ""} className={inputClass} placeholder="Describe la prenda, corte, estilo…" />
      </label>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-novva-white">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured ?? false}
          className="h-5 w-5 accent-novva-purple"
        />
        Marcar como <span className="font-semibold text-novva-purple">destacado</span> (aparece en la portada)
      </label>

      {/* Imágenes */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium text-novva-gray">
          Imágenes del producto ({existing.length})
        </span>

        {existing.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {existing.map((url) => (
              <div key={url} className="group relative h-28 w-22 overflow-hidden rounded-xl border border-novva-white/10">
                <Image src={url} alt="" fill sizes="88px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => setExisting((prev) => prev.filter((u) => u !== url))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-novva-black/80 text-novva-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Quitar imagen"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-novva-white/15 px-6 py-8 text-center transition-colors hover:border-novva-purple/60">
          <span className="text-sm font-semibold text-novva-purple">Subir imágenes</span>
          <span className="mt-1 text-xs text-novva-gray">
            JPG, PNG o WebP · máx 5MB c/u · hasta 2-3 por producto
          </span>
          <input name="images" type="file" accept="image/*" multiple className="hidden" />
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-novva-purple px-8 py-3 text-sm font-bold text-novva-black transition-all hover:bg-novva-pink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
