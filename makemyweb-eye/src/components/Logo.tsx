export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <img
      src="/images/logo-mark.webp"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
    />
  );
}
