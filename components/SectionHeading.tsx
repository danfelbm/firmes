import Badge from "./Badge";

type SectionHeadingProps = {
  kicker?: string;
  title: string;
  /** Palabra del título que se colorea (debe aparecer en `title`). */
  highlight?: string;
  highlightColor?: "yellow" | "blue";
  align?: "left" | "center";
};

export default function SectionHeading({
  kicker,
  title,
  highlight,
  highlightColor = "yellow",
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  // Sobre fondo claro el amarillo no funciona como color de texto: el
  // highlight amarillo se vuelve "resaltador" (texto ink sobre fondo amarillo).
  const colorClass =
    highlightColor === "blue"
      ? "text-blue"
      : "bg-yellow box-decoration-clone px-2 text-ink";

  let content: React.ReactNode = title;
  if (highlight && title.includes(highlight)) {
    const idx = title.indexOf(highlight);
    content = (
      <>
        {title.slice(0, idx)}
        <span className={colorClass}>{highlight}</span>
        {title.slice(idx + highlight.length)}
      </>
    );
  }

  return (
    <div className={isCenter ? "text-center" : ""}>
      {kicker ? (
        <div className="mb-5">
          <Badge>{kicker}</Badge>
        </div>
      ) : null}
      <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold text-ink">
        {content}
      </h2>
      <span
        className={`mt-5 block h-1 w-14 rounded-full bg-yellow ${isCenter ? "mx-auto" : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
