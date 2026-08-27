import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Universal Local Business Website System",
  description: "Sistema de diseño y arquitectura reutilizable para webs de negocios locales.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
