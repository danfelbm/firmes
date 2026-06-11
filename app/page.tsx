import { Banknote, Building2, HeartPulse } from "lucide-react";

import Card from "@/components/Card";
import CtaButton from "@/components/CtaButton";
import FichaCard from "@/components/FichaCard";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import QuickAccessBar from "@/components/QuickAccessBar";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import StatCounter from "@/components/StatCounter";

// MOCK — Fase 3D conecta datos reales (Supabase: fichas, noticias, enlaces).
const fichasMock = [
  {
    sector: "Justicia",
    pregunta:
      "¿Puede impartir justicia quien construyó su fortuna defendiendo a los que la evaden?",
    icono: "gavel",
    slug: "justicia",
  },
  {
    sector: "Salud",
    pregunta:
      "¿Qué propone para tu EPS alguien que litiga a favor del negocio y no del paciente?",
    icono: "heart-pulse",
    slug: "salud",
  },
  {
    sector: "Seguridad",
    pregunta:
      "¿Mano dura para quién? Su historial de clientes responde antes que su discurso.",
    icono: "shield",
    slug: "seguridad",
  },
  {
    sector: "Campo",
    pregunta:
      "¿Qué sabe del campesino que madruga quien nunca ha pisado una vereda sin escoltas?",
    icono: "tractor",
    slug: "campo",
  },
  {
    sector: "Educación",
    pregunta:
      "¿Universidad pública o privilegio? Lo que su programa calla sobre tus hijos.",
    icono: "graduation-cap",
    slug: "educacion",
  },
  {
    sector: "Economía popular",
    pregunta:
      "¿Qué le espera al tendero, al rebuscador y a la empleada doméstica con su modelo?",
    icono: "piggy-bank",
    slug: "economia-popular",
  },
];

// MOCK — Fase 3D conecta datos reales.
const noticiasMock = [
  {
    titular:
      "El abogado de los poderosos: los clientes que marcaron la carrera de De la Espriella",
    medio: "El Espectador",
    fecha: "2024-09-15",
    resumen:
      "Un repaso por dos décadas de litigios en los que el hoy candidato representó a políticos condenados, empresarios investigados y estructuras señaladas por la justicia colombiana.",
    link: "https://www.elespectador.com/",
  },
  {
    titular:
      "De la firma al búnker: el entramado empresarial detrás del 'Tigre'",
    medio: "La Silla Vacía",
    fecha: "2023-06-02",
    resumen:
      "Sociedades, fundaciones y oficinas satélite: la radiografía del conglomerado jurídico-mediático que hoy financia y amplifica la campaña presidencial del abogado cordobés.",
    link: "https://www.lasillavacia.com/",
  },
  {
    titular:
      "Las frases del candidato: cuando el rugido contradice el expediente",
    medio: "Cuestión Pública",
    fecha: "2025-11-20",
    resumen:
      "Comparamos diez promesas de tarima con los casos que el candidato litigó como abogado. El contraste entre el discurso patriótico y la práctica profesional es el hallazgo central.",
    link: "https://www.cuestionpublica.com/",
  },
];

// MOCK — Fase 3D conecta datos reales.
const temasArchivoMock = [
  "Paramilitarismo",
  "Clientes condenados",
  "Negocio de la salud",
  "DDHH y DIH",
  "Víctimas",
  "Falsos positivos",
  "Tierras",
  "Financiación de campaña",
  "Medios y propaganda",
  "Justicia",
  "Élites regionales",
  "Declaraciones públicas",
];

export default function Home() {
  return (
    <main>
      <Hero />
      <QuickAccessBar />

      {/* La Contracaja */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              kicker="31 fichas, un sector a la vez"
              title="La Contracaja"
              highlight="Contracaja"
            />
            <p className="mt-6 max-w-2xl text-muted">
              Lo que dice el candidato vs. lo que significa para tu vida. Cada
              ficha toma un sector, una promesa y la contrasta con los hechos
              documentados.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fichasMock.map((ficha, i) => (
              <Reveal key={ficha.slug} delay={i * 80}>
                <FichaCard {...ficha} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-12 text-center">
              <CtaButton href="/la-contracaja" variant="yellow">
                Ver las 31 fichas
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hemeroteca */}
      <section className="bg-navy-2 section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              kicker="14 años de prensa"
              title="Hemeroteca del Tigre"
              highlight="Tigre"
              highlightColor="blue"
            />
            <p className="mt-6 max-w-2xl text-muted">
              La prensa lleva años contando lo que la campaña prefiere olvidar.
              Aquí está el registro, medio por medio, año por año.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {noticiasMock.map((noticia, i) => (
              <Reveal key={noticia.link + noticia.fecha} delay={i * 80}>
                <NewsCard {...noticia} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={160}>
            <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
              <StatCounter value="72" label="Artículos" />
              <StatCounter value="14" label="Años de registro" />
              <StatCounter value="30+" label="Medios" />
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-12 text-center">
              <CtaButton href="/hemeroteca" variant="outline">
                Explorar la hemeroteca
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Banner Expediente DDHH */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="rounded-2xl border-2 border-red bg-navy-3 px-8 py-14 text-center md:px-16">
              <p className="text-xs font-bold uppercase tracking-widest text-red">
                Expediente DDHH y DIH
              </p>
              <blockquote className="mx-auto mt-6 max-w-3xl text-[clamp(1.4rem,3vw,2.25rem)] font-extrabold leading-snug text-white">
                <span className="text-yellow" aria-hidden="true">
                  &ldquo;
                </span>
                Quien aspira a comandar las Fuerzas Armadas debe responder
                primero por lo que defendió en los estrados.
                <span className="text-yellow" aria-hidden="true">
                  &rdquo;
                </span>
              </blockquote>
              {/* MOCK — Fase 3D conecta la cita real del expediente */}
              <p className="mt-4 text-sm font-medium text-muted">
                Expediente ciudadano · 7 secciones documentadas
              </p>
              <div className="mt-9">
                <CtaButton href="/expediente-ddhh" variant="red">
                  Abrir el Expediente
                </CtaButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* El negocio de la salud */}
      <section className="bg-navy-2 section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              kicker="Dossier"
              title="El negocio de la salud"
              highlight="salud"
            />
            <p className="mt-6 max-w-2xl text-muted">
              Tres claves para entender qué intereses defiende el candidato
              cuando habla de tu EPS, tu medicina y tu hospital.
            </p>
          </Reveal>
          {/* MOCK — Fase 3D conecta datos reales del dossier */}
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <Reveal delay={0}>
              <Card icon={Banknote} title="Los clientes del sector">
                EPS intervenidas, clínicas investigadas y aseguradoras en
                pleito: el portafolio de la firma habla del modelo de salud que
                defendería desde la Presidencia.
              </Card>
            </Reveal>
            <Reveal delay={80}>
              <Card icon={Building2} title="El entramado societario">
                Sociedades, fundaciones y participaciones cruzadas conectan la
                oficina jurídica con actores clave del negocio de la salud en
                Colombia.
              </Card>
            </Reveal>
            <Reveal delay={160}>
              <Card icon={HeartPulse} title="Lo que está en juego">
                Tu cita médica, tus medicamentos y tu hospital público: el
                dossier traduce los intereses del candidato a consecuencias
                concretas para el paciente.
              </Card>
            </Reveal>
          </div>
          <Reveal delay={220}>
            <div className="mt-12 text-center">
              <CtaButton href="/el-negocio-de-la-salud" variant="outline">
                Leer el dossier completo
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Archivo */}
      <section className="bg-navy section-padding">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <SectionHeading
              kicker="Todas las fuentes"
              title="El Archivo"
              highlight="Archivo"
            />
            <p className="mt-6 max-w-2xl text-muted">
              Cada afirmación de este portal tiene respaldo. El Archivo reúne
              los enlaces originales, organizados por tema.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 flex flex-wrap gap-3">
              {temasArchivoMock.map((tema) => (
                <span
                  key={tema}
                  className="rounded-full border border-white/15 bg-navy-2/80 px-4 py-2 text-sm font-semibold text-white/85"
                >
                  {tema}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-14 flex flex-col items-center gap-8">
              <StatCounter value="130+" label="Enlaces verificados" />
              <CtaButton href="/archivo" variant="red">
                Entrar al Archivo
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ruge la Calle */}
      <section className="bg-navy-2 section-padding">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              kicker="La banda sonora"
              title="Ruge la Calle"
              highlight="Calle"
              align="center"
            />
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              <strong className="text-white">CALLE</strong> es la respuesta
              musical de la veeduría: 7 minutos y 38 segundos de calle real,
              sin tarima ni libreto. Mientras el candidato ruge en los
              estudios, la calle pregunta en las esquinas.
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-yellow">
              El reproductor vive abajo a la izquierda — dale play y sigue
              leyendo.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
