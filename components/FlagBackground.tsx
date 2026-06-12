/**
 * Bandera colombiana ondeante en CSS puro, adaptada a fondo claro: franjas
 * tricolor suaves y desenfocadas + pliegues de luz que simulan la tela en
 * movimiento, bajo un velo cream que garantiza la legibilidad del texto.
 * Se coloca como fondo absoluto de la sección que la contenga (relative).
 */
export default function FlagBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Tela tricolor: franjas 50/25/25 desenfocadas y onduladas */}
      <div
        className="animate-flag-wave absolute -inset-x-[10%] inset-y-[-12%] opacity-30 blur-2xl"
        style={{
          background:
            "linear-gradient(178deg, #FFD23F 0%, #FFD23F 48%, #2D5BFF 50%, #2D5BFF 73%, #E63329 75%, #E63329 100%)",
        }}
      />
      {/* Pliegues: bandas diagonales de luz/sombra que ondulan a contratiempo */}
      <div
        className="animate-flag-wave absolute -inset-x-[12%] inset-y-[-12%] opacity-40 mix-blend-soft-light"
        style={{
          background:
            "repeating-linear-gradient(105deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.55) 90px, rgba(20,20,58,0.18) 200px, rgba(255,255,255,0) 310px)",
          animationDuration: "11s",
          animationDirection: "alternate-reverse",
          filter: "blur(28px)",
        }}
      />
      {/* Brillos radiales: puntos donde la tela "atrapa" el sol */}
      <div
        className="animate-flag-wave absolute -inset-x-[10%] inset-y-[-10%] opacity-50"
        style={{
          background:
            "radial-gradient(42% 36% at 22% 30%, rgba(255,255,255,0.5) 0%, transparent 70%), radial-gradient(36% 30% at 70% 62%, rgba(255,255,255,0.4) 0%, transparent 70%), radial-gradient(30% 26% at 48% 85%, rgba(255,255,255,0.3) 0%, transparent 70%)",
          animationDuration: "17s",
          filter: "blur(20px)",
        }}
      />
      {/* Velo cream: suaviza la bandera al fondo y protege la legibilidad */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,247,240,0.82) 0%, rgba(250,247,240,0.55) 40%, rgba(250,247,240,0.95) 100%)",
        }}
      />
    </div>
  );
}
