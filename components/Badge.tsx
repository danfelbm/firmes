export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-yellow px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink">
      {children}
    </span>
  );
}
