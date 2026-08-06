"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { site } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/catalog?sort=destacados", label: "Ofertas" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-novva-white/10 bg-novva-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-[0.25em] text-novva-white transition-colors hover:text-novva-purple"
        >
          NOVVA<span className="text-novva-purple">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-novva-gray md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("?")[0]);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-novva-white ${
                  isActive ? "text-novva-white" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden text-xs font-medium uppercase tracking-widest text-novva-gray transition-colors hover:text-novva-sky sm:block"
          >
            Admin
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-novva-white/15 text-novva-white transition-all hover:border-novva-purple hover:bg-novva-purple/10"
            aria-label={`Carrito (${count} artículos)`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-novva-pink px-1 text-[11px] font-bold text-novva-black">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
