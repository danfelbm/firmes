type StatCounterProps = {
  value: string;
  label: string;
};

export default function StatCounter({ value, label }: StatCounterProps) {
  return (
    <div className="text-center">
      <span className="block text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none text-yellow text-glow-yellow">
        {value}
      </span>
      <span className="mt-2 block text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  );
}
