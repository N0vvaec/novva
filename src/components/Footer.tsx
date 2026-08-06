import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-novva-white/10 bg-novva-deeppurple/20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold tracking-[0.25em] text-novva-white">
            NOVVA<span className="text-novva-purple">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-novva-gray">
            {site.tagline}. {site.description}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-novva-white">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-novva-gray">
            <li><Link className="transition-colors hover:text-novva-purple" href="/">Inicio</Link></li>
            <li><Link className="transition-colors hover:text-novva-purple" href="/catalog">Catálogo</Link></li>
            <li><Link className="transition-colors hover:text-novva-purple" href="/cart">Carrito</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-novva-white">
            Síguenos
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-novva-gray">
            {site.instagram && (
              <li>
                <a className="transition-colors hover:text-novva-pink" href={site.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            )}
            {site.tiktok && (
              <li>
                <a className="transition-colors hover:text-novva-sky" href={site.tiktok} target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
              </li>
            )}
            {site.facebook && (
              <li>
                <a className="transition-colors hover:text-novva-lavender" href={site.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
            )}
            {!site.instagram && !site.tiktok && !site.facebook && (
              <li className="text-novva-gray/70">Próximamente</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-novva-white/5 py-5 text-center text-xs text-novva-gray/70">
        © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
