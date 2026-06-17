"use client";

import { useState } from "react";

/**
 * Observaciones del archivo: algunas llegan a ~1.600 caracteres. Las cortas se
 * muestran tal cual; las largas se recortan con un toggle "Ver más / Ver menos"
 * para no romper la lectura del listado. Componente client mínimo: el resto de
 * EnlaceCard sigue siendo server component.
 */
const UMBRAL = 180;

type ObservacionLargaProps = {
  texto: string;
  className?: string;
};

export default function ObservacionLarga({
  texto,
  className,
}: ObservacionLargaProps) {
  const [abierto, setAbierto] = useState(false);
  const esLarga = texto.length > UMBRAL;

  if (!esLarga) {
    return <span className={className}>{texto}</span>;
  }

  return (
    <span className={className}>
      <span className={abierto ? undefined : "line-clamp-3"}>{texto}</span>
      <button
        type="button"
        onClick={(e) => {
          // EnlaceCard envuelve la tarjeta en un <a>; evitamos navegar al togglear.
          e.preventDefault();
          e.stopPropagation();
          setAbierto((v) => !v);
        }}
        aria-expanded={abierto}
        className="mt-1 block text-xs font-bold uppercase tracking-wide text-blue transition-colors hover:text-red"
      >
        {abierto ? "Ver menos" : "Ver más"}
      </button>
    </span>
  );
}
