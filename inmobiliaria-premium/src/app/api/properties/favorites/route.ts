import { NextResponse } from "next/server";
import { getPropertiesByIds } from "@/lib/properties";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const properties = await getPropertiesByIds(ids);
  return NextResponse.json({ properties });
}
