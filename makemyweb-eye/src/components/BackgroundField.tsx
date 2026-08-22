/**
 * The site's permanent backdrop: the exact frame the intro freezes on
 * (public/images/iris-bg.jpg, captured from the video at the same
 * VIDEO_CUTOFF/zoom used in IntroExperience). Fixed behind every section so
 * the intro hands off to the page by simply fading itself out — both show
 * the same pixels, so there's nothing to notice.
 */
export function BackgroundField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/iris-bg.jpg)" }}
      />
      {/* light wash so text stays legible without hiding the photo */}
      <div className="absolute inset-0 bg-charcoal/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/15 to-charcoal/55" />
    </div>
  );
}
