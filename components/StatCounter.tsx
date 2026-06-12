type StatCounterProps = {
  value: string;
  label: string;
};

export default function StatCounter({ value, label }: StatCounterProps) {
  return (
    <div className="text-center">
      <span className="block text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none text-ink">
        {value}
      </span>
      <span
        className="mx-auto mt-3 block h-1.5 w-12 rounded-full bg-yellow"
        aria-hidden="true"
      />
      <span className="mt-3 block text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  );
}
