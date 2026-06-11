/**
 * Bandera colombiana ondeante en CSS puro: franjas tricolor desenfocadas
 * + capas de "luz" radial que simulan los pliegues de una tela en movimiento.
 * Se coloca como fondo absoluto de la sección que la contenga (relative).
 */
export default function FlagBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Tela tricolor: franjas 50/25/25 desenfocadas y onduladas */}
      <div
        className="animate-flag-wave absolute -inset-x-[10%] inset-y-[-12%] opacity-25 blur-2xl"
        style={{
          background:
            "linear-gradient(178deg, #FFD23F 0%, #FFD23F 48%, #2D5BFF 50%, #2D5BFF 73%, #E63329 75%, #E63329 100%)",
        }}
      />
      {/* Pliegues: bandas diagonales de sombra/luz que ondulan a contratiempo */}
      <div
        className="animate-flag-wave absolute -inset-x-[12%] inset-y-[-12%] opacity-50 mix-blend-overlay"
        style={{
          background:
            "repeating-linear-gradient(105deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.28) 90px, rgba(13,13,43,0.55) 200px, rgba(255,255,255,0) 310px)",
          animationDuration: "11s",
          animationDirection: "alternate-reverse",
          filter: "blur(28px)",
        }}
      />
      {/* Brillos radiales: puntos de luz donde la tela "atrapa" el sol */}
      <div
        className="animate-flag-wave absolute -inset-x-[10%] inset-y-[-10%] opacity-40"
        style={{
          background:
            "radial-gradient(42% 36% at 22% 30%, rgba(255,255,255,0.22) 0%, transparent 70%), radial-gradient(36% 30% at 70% 62%, rgba(255,255,255,0.14) 0%, transparent 70%), radial-gradient(30% 26% at 48% 85%, rgba(255,255,255,0.1) 0%, transparent 70%)",
          animationDuration: "17s",
          filter: "blur(20px)",
        }}
      />
      {/* Velo navy: hunde la bandera al fondo y protege la legibilidad */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,13,43,0.78) 0%, rgba(13,13,43,0.55) 40%, rgba(13,13,43,0.92) 100%)",
        }}
      />
    </div>
  );
}
