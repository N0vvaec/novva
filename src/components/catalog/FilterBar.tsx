"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "Única"];
const COLOR_OPTIONS = [
  "Negro",
  "Blanco",
  "Gris",
  "Morado",
  "Rosa",
  "Celeste",
  "Lavanda",
  "Azul",
];
const SORT_OPTIONS = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "destacados", label: "Destacados" },
];

interface FilterBarProps {
  categories: string[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      const qs = params.toString();
      router.push(qs ? `/catalog?${qs}` : "/catalog");
    },
    [router, searchParams],
  );

  const activeFilters =
    searchParams.toString().length > 0 &&
    (searchParams.get("category") ||
      searchParams.get("size") ||
      searchParams.get("color") ||
      searchParams.get("minPrice") ||
      searchParams.get("maxPrice"));

  const selectClass =
    "rounded-xl border border-novva-white/15 bg-novva-black px-3 py-2.5 text-sm text-novva-white outline-none transition-colors focus:border-novva-purple";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-novva-white/10 bg-novva-white/[0.03] p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <label className="flex flex-col gap-1 text-xs font-medium text-novva-gray">
          Categoría
          <select
            className={selectClass}
            value={searchParams.get("category") ?? ""}
            onChange={(e) => buildUrl({ category: e.target.value })}
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-novva-gray">
          Talla
          <select
            className={selectClass}
            value={searchParams.get("size") ?? ""}
            onChange={(e) => buildUrl({ size: e.target.value })}
          >
            <option value="">Todas</option>
            {SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-novva-gray">
          Color
          <select
            className={selectClass}
            value={searchParams.get("color") ?? ""}
            onChange={(e) => buildUrl({ color: e.target.value })}
          >
            <option value="">Todos</option>
            {COLOR_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1 text-xs font-medium text-novva-gray">
          <span>Precio (USD)</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Mín"
              className={`${selectClass} w-full`}
              defaultValue={searchParams.get("minPrice") ?? ""}
              onBlur={(e) => buildUrl({ minPrice: e.target.value })}
            />
            <span className="text-novva-gray">–</span>
            <input
              type="number"
              min={0}
              placeholder="Máx"
              className={`${selectClass} w-full`}
              defaultValue={searchParams.get("maxPrice") ?? ""}
              onBlur={(e) => buildUrl({ maxPrice: e.target.value })}
            />
          </div>
        </div>

        <label className="flex flex-col gap-1 text-xs font-medium text-novva-gray">
          Ordenar
          <select
            className={selectClass}
            value={searchParams.get("sort") ?? "recientes"}
            onChange={(e) => buildUrl({ sort: e.target.value })}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {activeFilters && (
        <button
          onClick={() => router.push("/catalog")}
          className="self-start rounded-full border border-novva-white/15 px-4 py-1.5 text-xs font-semibold text-novva-gray transition-colors hover:border-novva-pink hover:text-novva-pink"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
