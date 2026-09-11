"use client";

import { usePathname } from "next/navigation";
import { siteConfig, whatsappHref, whatsappMessages } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/icons";

function messageForPath(pathname: string) {
  if (pathname.startsWith("/permisos/permiso-a2")) return whatsappMessages.permitA2;
  if (pathname.startsWith("/permisos/permiso-b")) return whatsappMessages.permitB;
  return whatsappMessages.general;
}

export default function WhatsAppButton() {
  const pathname = usePathname();
  const href = whatsappHref(messageForPath(pathname), siteConfig.whatsapp.number);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon />
    </a>
  );
}
