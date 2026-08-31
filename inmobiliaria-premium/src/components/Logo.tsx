import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  mark?: boolean;
  tone?: "dark" | "light";
}

export function Logo({ className, mark = true, tone = "dark" }: LogoProps) {
  const textColor = tone === "dark" ? "#17140f" : "#f7f4ee";

  return (
    <svg
      viewBox="0 0 220 42"
      className={cn("h-7 w-auto", className)}
      role="img"
      aria-label="Inmo Retail"
    >
      {mark && (
        <path
          d="M4 24 L20 6 L28 14 L28 4 L34 4 L34 20 L36 22"
          fill="none"
          stroke="#b3134f"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <text
        x={mark ? "42" : "0"}
        y="29"
        fontFamily="var(--font-sans-body), sans-serif"
        fontWeight="600"
        fontSize="21"
        letterSpacing="-0.02em"
        fill={textColor}
      >
        Inmo<tspan fill="#b3134f">Retail</tspan>
      </text>
    </svg>
  );
}
