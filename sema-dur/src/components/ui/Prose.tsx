import type { ReactNode } from "react";

export default function Prose({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`prose-block max-w-none ${className}`}>{children}</div>;
}
