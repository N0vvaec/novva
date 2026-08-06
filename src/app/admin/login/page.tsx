import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="mx-auto flex max-w-md flex-col">
      <div className="rounded-3xl border border-novva-white/10 bg-novva-white/[0.03] p-8">
        <h1 className="text-2xl font-extrabold text-novva-white">Panel de administración</h1>
        <p className="mt-2 text-sm text-novva-gray">
          Ingresa con tu cuenta de administrador para gestionar el catálogo.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
