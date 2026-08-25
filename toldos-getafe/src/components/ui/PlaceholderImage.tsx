type PlaceholderImageProps = {
  label: string;
  className?: string;
};

/**
 * Temporary stand-in until real photography from toldosgetafe.es is sourced
 * and dropped into /public. Swap for next/image once assets land.
 */
export default function PlaceholderImage({
  label,
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-light/40 via-paper-soft to-line ${className}`}
    >
      <span className="px-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-stone">
        {label}
      </span>
    </div>
  );
}
