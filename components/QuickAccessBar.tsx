import Link from "next/link";
import {
  Archive,
  Flower2,
  HeartPulse,
  Layers,
  Newspaper,
  Scale,
  type LucideIcon,
} from "lucide-react";

type QuickItem = { href: string; label: string; icon: LucideIcon };

const items: QuickItem[] = [
  { href: "/la-contracaja", label: "Contracaja", icon: Layers },
  { href: "/hemeroteca", label: "Hemeroteca", icon: Newspaper },
  { href: "/expediente-ddhh", label: "Expediente", icon: Scale },
  { href: "/la-voz-de-las-victimas", label: "Víctimas", icon: Flower2 },
  { href: "/el-negocio-de-la-salud", label: "Salud", icon: HeartPulse },
  { href: "/archivo", label: "Archivo", icon: Archive },
];

export default function QuickAccessBar() {
  return (
    <div className="relative z-10 mx-auto -mt-12 max-w-5xl px-6">
      <nav
        className="grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-navy-2/90 p-3 shadow-2xl shadow-ink/60 backdrop-blur md:grid-cols-6"
        aria-label="Accesos rápidos"
      >
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center gap-2 rounded-xl px-2 py-4 transition-colors hover:bg-white/5"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-blue text-white transition-transform group-hover:-translate-y-0.5">
              <Icon size={20} strokeWidth={2.25} aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold text-white/85 group-hover:text-yellow">
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
