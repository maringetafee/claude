export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="max-w-3xl space-y-5 text-ink-soft
      [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:text-ink [&_h2]:sm:text-3xl
      [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:leading-tight [&_h3]:text-ink
      [&_p]:leading-relaxed
      [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2
      [&_li]:leading-relaxed
      [&_strong]:font-medium [&_strong]:text-ink"
    >
      {children}
    </div>
  );
}
