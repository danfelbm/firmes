"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ARCHIVO_LINK, NAV_LINKS } from "@/lib/constants";

function LogoStacked() {
  return (
    <Link href="/" className="flex flex-col leading-none">
      <span className="text-xl font-extrabold tracking-tight text-white">
        FIRMES
      </span>
      <span className="text-[0.6rem] font-bold uppercase tracking-widest text-yellow">
        Por la Patria
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <LogoStacked />

        {/* Navegación de escritorio con separadores | finos */}
        <nav className="hidden items-center lg:flex" aria-label="Principal">
          {NAV_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center">
              {i > 0 ? (
                <span className="mx-1 h-4 w-px bg-white/20" aria-hidden="true" />
              ) : null}
              <Link
                href={link.href}
                className="px-3 py-2 text-[0.8rem] font-semibold text-white/85 transition-colors hover:text-yellow"
              >
                {link.label}
              </Link>
            </span>
          ))}
          <Link
            href={ARCHIVO_LINK.href}
            className="ml-4 rounded-lg bg-red px-4 py-2 text-[0.8rem] font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
          >
            {ARCHIVO_LINK.label}
          </Link>
        </nav>

        {/* Hamburguesa móvil */}
        <button
          type="button"
          className="text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Drawer móvil */}
      {open ? (
        <nav
          className="border-t border-white/10 bg-navy-2 px-6 py-4 lg:hidden"
          aria-label="Principal móvil"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-3 font-semibold text-white/90 transition-colors hover:bg-white/5 hover:text-yellow"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link
                href={ARCHIVO_LINK.href}
                className="block rounded-lg bg-red px-4 py-3 text-center font-bold uppercase tracking-wide text-white"
                onClick={() => setOpen(false)}
              >
                {ARCHIVO_LINK.label}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
