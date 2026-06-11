import type { LucideIcon } from "lucide-react";

type CardProps = {
  icon?: LucideIcon;
  title: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Card({
  icon: Icon,
  title,
  children,
  className = "",
}: CardProps) {
  return (
    <article
      className={`rounded-xl border border-white/10 bg-navy-2/80 p-7 transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      {Icon ? (
        <span className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-blue text-white">
          <Icon size={22} strokeWidth={2.25} aria-hidden="true" />
        </span>
      ) : null}
      <h3 className="yellow-tick text-lg font-bold text-white">{title}</h3>
      <div className="mt-4 text-sm leading-relaxed text-muted">{children}</div>
    </article>
  );
}
