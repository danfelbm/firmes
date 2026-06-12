import Link from "next/link";
import {
  Baby,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  DollarSign,
  Droplets,
  Eye,
  Factory,
  FileText,
  Flower2,
  Gavel,
  Globe,
  GraduationCap,
  Hammer,
  Handshake,
  HeartHandshake,
  HeartPulse,
  House,
  Landmark,
  Leaf,
  Lock,
  Megaphone,
  Mountain,
  PiggyBank,
  Scale,
  Shield,
  Siren,
  Stethoscope,
  Tractor,
  TriangleAlert,
  Users,
  Wallet,
  Wheat,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapa explícito nombre-de-icono → componente lucide (sin imports dinámicos).
 * Los nombres en kebab-case son los que guarda la tabla `fichas` en Supabase.
 */
const iconMap: Record<string, LucideIcon> = {
  baby: Baby,
  banknote: Banknote,
  "book-open": BookOpen,
  briefcase: Briefcase,
  "building-2": Building2,
  bus: Bus,
  "dollar-sign": DollarSign,
  droplets: Droplets,
  eye: Eye,
  factory: Factory,
  "file-text": FileText,
  "flower-2": Flower2,
  gavel: Gavel,
  globe: Globe,
  "graduation-cap": GraduationCap,
  hammer: Hammer,
  handshake: Handshake,
  "heart-handshake": HeartHandshake,
  "heart-pulse": HeartPulse,
  house: House,
  landmark: Landmark,
  leaf: Leaf,
  lock: Lock,
  megaphone: Megaphone,
  mountain: Mountain,
  "piggy-bank": PiggyBank,
  scale: Scale,
  shield: Shield,
  siren: Siren,
  stethoscope: Stethoscope,
  tractor: Tractor,
  "triangle-alert": TriangleAlert,
  users: Users,
  wallet: Wallet,
  wheat: Wheat,
  wifi: Wifi,
  zap: Zap,
};

type FichaCardProps = {
  sector: string;
  pregunta: string;
  icono: string;
  slug: string;
};

export default function FichaCard({
  sector,
  pregunta,
  icono,
  slug,
}: FichaCardProps) {
  const Icon = iconMap[icono] ?? FileText;

  return (
    <Link
      href={`/el-milagro/${slug}`}
      className="card-shadow group flex h-full flex-col rounded-xl border border-ink/10 bg-paper p-7 transition-all duration-200 hover:-translate-y-1 hover:border-yellow/60"
    >
      <span className="mb-5 inline-flex size-12 items-center justify-center self-start rounded-full bg-blue text-white">
        <Icon size={22} strokeWidth={2.25} aria-hidden="true" />
      </span>
      <h3 className="yellow-tick text-lg font-bold text-ink">{sector}</h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
        {pregunta}
      </p>
      <span className="mt-5 text-sm font-bold text-blue transition-colors group-hover:text-red">
        Conozca el milagro <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
