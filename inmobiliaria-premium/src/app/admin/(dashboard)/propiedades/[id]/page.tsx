import { notFound } from "next/navigation";
import { getPropertyByIdAdmin } from "@/lib/admin/properties";
import { PropertyEditor } from "../PropertyEditor";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyByIdAdmin(id);
  if (!property) notFound();

  return (
    <div>
      <span className="block text-[0.72rem] font-medium uppercase tracking-[0.24em] text-stone">
        Panel
      </span>
      <h1 className="mt-2 font-serif text-3xl font-light text-ink">{property.title}</h1>
      <div className="mt-10">
        <PropertyEditor mode="edit" property={property} />
      </div>
    </div>
  );
}
