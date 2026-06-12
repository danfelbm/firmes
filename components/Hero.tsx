import Badge from "./Badge";
import CtaButton from "./CtaButton";
import FlagBackground from "./FlagBackground";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <FlagBackground />
      <div className="relative mx-auto flex min-h-[88svh] max-w-7xl flex-col items-start justify-center px-6 py-28">
        <Badge>El Portal del Tigre · De pie por la Patria</Badge>
        <h1 className="mt-8 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase">
          <span className="block text-white">El Tigre</span>
          <span className="block text-yellow text-glow-yellow">como es.</span>
          <span className="block text-blue">Completo.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
          Todo lo que Abelardo de la Espriella ha dicho y hecho en 18 años,
          reunido en un solo lugar. Sin recortes. Sin editar. Con orgullo.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <CtaButton href="/el-milagro" variant="yellow">
            Conozca el Milagro
          </CtaButton>
          <CtaButton href="/prensa" variant="outline">
            El Tigre en los medios
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
