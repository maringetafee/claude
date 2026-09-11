export default function Eyebrow({
  children,
  tone = "signal",
}: {
  children: React.ReactNode;
  tone?: "signal" | "amber" | "ink";
}) {
  const dot = {
    signal: "bg-signal",
    amber: "bg-amber",
    ink: "bg-ink",
  }[tone];

  return (
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {children}
    </p>
  );
}
