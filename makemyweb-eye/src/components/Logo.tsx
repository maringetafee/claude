export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M22 8 C 25 17, 20 25, 23 40"
        stroke="#12213d"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M28 8 C 24 17, 18 24, 21 40"
        stroke="#2fbf9f"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
