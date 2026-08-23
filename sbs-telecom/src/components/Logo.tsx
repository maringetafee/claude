export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="25" height="25" rx="5.5" stroke="currentColor" strokeOpacity="0.25" />
        <path d="M13 6L13 20M7 13L19 13" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.35" />
        <circle cx="13" cy="13" r="3" fill="var(--color-signal-500)" />
      </svg>
      <span className="font-display text-[15px] font-bold tracking-tight leading-none">
        S.B.S
        <span className="ml-1.5 font-mono text-[10px] font-normal tracking-[0.14em] text-bone-400">
          TELECOMUNICACIONES
        </span>
      </span>
    </span>
  );
}
