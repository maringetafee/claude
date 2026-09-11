import "./admin.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: { default: `Panel · ${BRAND.name}`, template: `%s · Panel ${BRAND.name}` },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="adm">{children}</div>;
}
