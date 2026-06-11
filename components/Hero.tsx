import Badge from "./Badge";
import CtaButton from "./CtaButton";
import FlagBackground from "./FlagBackground";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <FlagBackground />
      <div className="relative mx-auto flex min-h-[88svh] max-w-7xl flex-col items-start justify-center px-6 py-28">
        <Badge>Veeduría ciudadana · Elecciones 2026</Badge>
        <h1 className="mt-8 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase">
          <span className="block text-white">La Patria</span>
          <span className="block text-yellow text-glow-yellow">no ruge,</span>
          <span className="block text-blue">pregunta.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
          Detrás del rugido hay un candidato con historia, negocios y un
          expediente. Aquí está, documentado y con fuentes, lo que Abelardo de
          la Espriella no cuenta en la tarima.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <CtaButton href="/expediente-ddhh" variant="red">
            Abrir el Expediente
          </CtaButton>
          <CtaButton href="/la-contracaja" variant="outline">
            La Contracaja
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
