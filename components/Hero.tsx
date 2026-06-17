import Image from "next/image";

import Badge from "./Badge";
import CtaButton from "./CtaButton";
import FlagBackground from "./FlagBackground";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <FlagBackground />
      <div className="relative mx-auto grid min-h-[88svh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-28 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-start">
          <Badge>El Portal del Tigre · De pie por la Patria</Badge>
          <h1 className="mt-8 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase">
            <span className="block text-ink">El Tigre</span>
            <span className="block text-blue">como es.</span>
            <span className="block text-red">Completo.</span>
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

        {/* Retrato del candidato */}
        <div className="relative w-full">
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-yellow/30 blur-2xl" aria-hidden="true" />
          <figure className="card-shadow w-full overflow-hidden rounded-3xl border border-ink/10 bg-paper">
            <Image
              src="/abelardo/hero.webp"
              alt="Abelardo de la Espriella, candidato presidencial, ante el escudo de Colombia"
              width={900}
              height={675}
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="bg-navy px-5 py-3 text-sm font-semibold text-white">
              El Tigre, de frente y sin maquillaje.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
