import Link from "next/link";
import { ARCHIVO_LINK, NAV_LINKS } from "@/lib/constants";

// Iconos de marca como SVG inline (lucide 1.x eliminó los brand icons).
const socials = [
  {
    label: "Facebook",
    href: "#",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z",
  },
  {
    label: "X (Twitter)",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1fr_auto]">
        <div>
          <p className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-white">
              FIRMES
            </span>
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-yellow">
              Por la Patria
            </span>
          </p>
          {/* white/70 en lugar de text-muted: el token muted ahora es oscuro
              (para fondos claros) y este bloque sigue siendo navy. */}
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
            El portal del Tigre: todo lo que Abelardo de la Espriella ha dicho
            y hecho, reunido con orgullo y con sus fuentes.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-yellow hover:text-yellow"
                aria-label={s.label}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Mapa del sitio">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow">
            Mapa del sitio
          </p>
          <ul className="mt-4 space-y-2.5">
            {[...NAV_LINKS, ARCHIVO_LINK].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-white/80 transition-colors hover:text-yellow"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-6 text-center text-xs font-medium tracking-wide text-white/70">
          Firmes por la Patria · Colombia 2026 · La verdad completa, con
          orgullo.
        </p>
      </div>
    </footer>
  );
}
