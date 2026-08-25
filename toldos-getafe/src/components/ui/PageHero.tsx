type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <div className="flex min-h-[65vh] flex-col justify-end px-6 pb-14 pt-32 [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/70">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] text-paper sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-5 max-w-xl text-paper/80 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
