"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/lib/types";

const PropertiesMap = dynamic(
  () => import("@/components/map/PropertiesMap").then((m) => m.PropertiesMap),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-paper-dim" /> }
);

export function MapPreview({ properties }: { properties: Property[] }) {
  return <PropertiesMap properties={properties} />;
}
