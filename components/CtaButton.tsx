import Link from "next/link";

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "yellow" | "red" | "outline";
};

const variants: Record<NonNullable<CtaButtonProps["variant"]>, string> = {
  yellow: "bg-yellow text-ink hover:brightness-105",
  red: "bg-red text-white hover:brightness-110",
  outline: "border-2 border-ink text-ink hover:bg-ink/5",
};

export default function CtaButton({
  href,
  children,
  variant = "yellow",
}: CtaButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 ${variants[variant]}`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
