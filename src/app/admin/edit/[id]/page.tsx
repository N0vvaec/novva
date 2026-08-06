import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin";
import { getProductById } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/actions";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="text-sm text-novva-gray transition-colors hover:text-novva-purple">
        ← Volver al dashboard
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold text-novva-white">Editar producto</h1>
      <div className="mt-6">
        <ProductForm action={updateProduct.bind(null, product.id)} product={product} />
      </div>
    </div>
  );
}
