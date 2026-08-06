import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/actions";

export default async function AdminNewProductPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="text-sm text-novva-gray transition-colors hover:text-novva-purple">
        ← Volver al dashboard
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold text-novva-white">Nuevo producto</h1>
      <div className="mt-6">
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
