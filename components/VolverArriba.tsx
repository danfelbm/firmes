"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Botón flotante "Volver arriba". Aparece tras desplazarse hacia abajo y
 * hace scroll suave al inicio. Se ancla abajo a la derecha (el AudioDock ocupa
 * la esquina izquierda).
 */
export default function VolverArriba() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > 600);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="card-shadow fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-4 py-3 text-sm font-bold text-ink transition-colors hover:border-yellow hover:text-blue"
      aria-label="Volver arriba"
    >
      <ArrowUp size={18} strokeWidth={2.5} aria-hidden="true" />
      <span className="hidden sm:inline">Volver arriba</span>
    </button>
  );
}
