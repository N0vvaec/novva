import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/site";
import { deleteProduct, logout } from "@/app/admin/actions";

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const products = await getAllProducts();

  const onSale = products.filter((p) => p.originalPrice).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-novva-white">Dashboard</h1>
          <p className="mt-1 text-sm text-novva-gray">
            Hola, {admin.email} · Rol: {admin.role}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="rounded-full bg-novva-purple px-5 py-2.5 text-sm font-bold text-novva-black transition-all hover:bg-novva-pink"
          >
            + Nuevo producto
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-novva-white/15 px-5 py-2.5 text-sm font-semibold text-novva-gray transition-colors hover:border-novva-pink hover:text-novva-pink"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Productos", value: products.length, color: "text-novva-purple" },
          { label: "En oferta", value: onSale, color: "text-novva-pink" },
          { label: "Agotados", value: outOfStock, color: "text-novva-sky" },
          { label: "Unidades en stock", value: totalStock, color: "text-novva-lavender" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-novva-white/10 bg-novva-white/[0.03] p-5"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-novva-gray">
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Products table */}
      <div className="overflow-hidden rounded-2xl border border-novva-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-novva-white/10 bg-novva-white/[0.03] text-xs uppercase tracking-wider text-novva-gray">
              <tr>
                <th className="px-4 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Oferta</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-novva-white/5">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-novva-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-novva-white/5">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs font-bold text-novva-purple">
                            N
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-novva-white">{product.name}</p>
                        <p className="text-xs text-novva-gray">
                          {product.images.length} img · {product.sizes.length} tallas
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-novva-gray">{product.category}</td>
                  <td className="px-4 py-3 text-novva-white">
                    {formatPrice(product.price)}
                    {product.originalPrice && (
                      <span className="ml-2 text-xs text-novva-gray line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.stock === 0
                          ? "bg-red-500/15 text-red-400"
                          : product.stock <= 5
                            ? "bg-yellow-500/15 text-yellow-400"
                            : "bg-green-500/15 text-green-400"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.originalPrice ? (
                      <span className="rounded-full bg-novva-pink/15 px-2.5 py-1 text-xs font-bold text-novva-pink">
                        -
                        {Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    ) : (
                      <span className="text-xs text-novva-gray">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/edit/${product.id}`}
                        className="rounded-lg border border-novva-white/15 px-3 py-1.5 text-xs font-semibold text-novva-white transition-colors hover:border-novva-sky hover:text-novva-sky"
                      >
                        Editar
                      </Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <button
                          type="submit"
                          className="rounded-lg border border-novva-white/15 px-3 py-1.5 text-xs font-semibold text-novva-gray transition-colors hover:border-novva-pink hover:text-novva-pink"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <p className="py-12 text-center text-novva-gray">
            Aún no hay productos. Crea el primero.
          </p>
        )}
      </div>
    </div>
  );
}
