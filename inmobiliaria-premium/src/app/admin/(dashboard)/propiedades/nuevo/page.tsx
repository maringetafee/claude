import { PropertyEditor } from "../PropertyEditor";

export default function NewPropertyPage() {
  return (
    <div>
      <span className="block text-[0.72rem] font-medium uppercase tracking-[0.24em] text-stone">
        Panel
      </span>
      <h1 className="mt-2 font-serif text-3xl font-light text-ink">Nueva propiedad</h1>
      <div className="mt-10">
        <PropertyEditor mode="create" />
      </div>
    </div>
  );
}
