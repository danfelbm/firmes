type NewsCardProps = {
  titular: string;
  medio: string;
  fecha: string; // ISO o parseable por Date
  resumen: string;
  link: string;
  /** true = teaser de 3 líneas (home); false = resumen completo (hemeroteca). */
  compacto?: boolean;
};

export default function NewsCard({
  titular,
  medio,
  fecha,
  resumen,
  link,
  compacto = false,
}: NewsCardProps) {
  const fechaFormateada = new Date(fecha).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="flex h-full flex-col rounded-xl border border-white/10 bg-navy-2/80 p-7 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-blue/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-blue">
          {medio}
        </span>
        <time dateTime={fecha} className="text-xs font-medium text-muted">
          {fechaFormateada}
        </time>
      </div>
      <h3 className="yellow-tick mt-5 text-lg font-bold leading-snug text-white">
        {titular}
      </h3>
      <p
        className={`mt-4 flex-1 text-sm leading-relaxed text-muted ${compacto ? "line-clamp-3" : ""}`}
      >
        {resumen}
      </p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-5 text-sm font-bold text-yellow transition-colors hover:text-white"
      >
        Leer en {medio} <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
