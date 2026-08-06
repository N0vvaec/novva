import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — NOVVA",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-full">
      <header className="border-b border-novva-white/10 bg-novva-black">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/admin"
            className="text-sm font-extrabold tracking-[0.2em] text-novva-white"
          >
            NOVVA<span className="text-novva-purple"> · ADMIN</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-novva-gray transition-colors hover:text-novva-purple"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
