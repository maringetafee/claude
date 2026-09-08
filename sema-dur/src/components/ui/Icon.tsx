type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
  title?: string;
};

export type IconName =
  | "cart"
  | "search"
  | "menu"
  | "close"
  | "chevron-down"
  | "chevron-right"
  | "arrow-right"
  | "arrow-up-right"
  | "phone"
  | "whatsapp"
  | "mail"
  | "pin"
  | "check"
  | "plus"
  | "minus"
  | "user"
  | "clock"
  | "shield"
  | "wrench"
  | "sparkle"
  | "file"
  | "quote"
  | "facebook"
  | "instagram";

const paths: Record<IconName, React.ReactNode> = {
  cart: (
    <>
      <path d="M3 4h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L22 8H6" />
      <circle cx="10" cy="21" r="1" />
      <circle cx="18" cy="21" r="1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "arrow-right": (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17 17 7M8 7h9v9" />
    </>
  ),
  phone: (
    <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1Z" />
  ),
  whatsapp: (
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm4.7 12.3c-.2.6-1.1 1.1-1.6 1.1-.4 0-1 .1-3.2-.9a10.8 10.8 0 0 1-4.3-4.4c-.9-1.6-.7-2.6-.5-3 .2-.4.6-.6.9-.6h.6c.2 0 .4 0 .6.5l.7 1.7c.1.2 0 .5-.1.6l-.4.5c-.1.2-.3.3-.1.6a8 8 0 0 0 3 2.6c.3.2.5.1.7-.1l.6-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.2.5.3.1.2.1.6-.1 1.1Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  check: <path d="m4 12 5 5L20 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V6Z" />,
  wrench: (
    <path d="M14.5 6.5a4 4 0 0 0-5.4 4.6l-6 6a2 2 0 0 0 2.8 2.8l6-6a4 4 0 0 0 4.6-5.4l-2.4 2.4-2-2Z" />
  ),
  sparkle: (
    <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" />
  ),
  file: (
    <>
      <path d="M7 3h7l5 5v13H7Z" />
      <path d="M14 3v5h5" />
    </>
  ),
  quote: (
    <>
      <path d="M4 6h10M4 12h16M4 18h12" />
    </>
  ),
  facebook: (
    <path d="M14 8.5h2V5.5h-2c-2 0-3.2 1.3-3.2 3.3V11H9v3h1.8v6h3v-6h2.2l.5-3h-2.7V9.4c0-.6.3-.9 1-.9Z" />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.6" cy="7.4" r="0.6" fill="currentColor" />
    </>
  ),
};

export default function Icon({ name, className, size = 20, title }: IconProps) {
  const filled =
    name === "whatsapp" ||
    name === "shield" ||
    name === "sparkle" ||
    name === "facebook";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
