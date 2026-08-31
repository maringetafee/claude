import { createClient } from "@/lib/supabase/server";
import { SubmissionActions } from "./SubmissionActions";

interface SubmissionRow {
  id: string;
  property_title: string | null;
  property_reference: string | null;
  name: string;
  surname: string | null;
  email: string;
  phone: string;
  message: string;
  reason: string | null;
  status: string;
  created_at: string;
}

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const submissions = (data ?? []) as SubmissionRow[];

  return (
    <div>
      <span className="block text-[0.72rem] font-medium uppercase tracking-[0.24em] text-stone">
        Panel
      </span>
      <h1 className="mt-2 font-serif text-3xl font-light text-ink">Mensajes</h1>

      <div className="mt-10 overflow-x-auto border border-line">
        <table className="w-full min-w-[900px] border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="border-b border-line text-[0.68rem] uppercase tracking-[0.14em] text-stone">
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Interés</th>
              <th className="px-4 py-3 font-medium">Mensaje</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-stone">
                  Todavía no ha llegado ningún mensaje.
                </td>
              </tr>
            )}
            {submissions.map((s) => (
              <tr key={s.id} className="border-b border-line align-top last:border-b-0">
                <td className="whitespace-nowrap px-4 py-3 text-stone">
                  {new Date(s.created_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-ink">
                  {s.name} {s.surname ?? ""}
                </td>
                <td className="px-4 py-3 text-stone">
                  <div>{s.email}</div>
                  <div>{s.phone}</div>
                </td>
                <td className="px-4 py-3 text-stone">
                  {s.property_title ? (
                    <>
                      {s.property_title}
                      {s.property_reference && (
                        <span className="block text-[0.72rem]">{s.property_reference}</span>
                      )}
                    </>
                  ) : (
                    <span>Consulta general{s.reason ? ` · ${s.reason}` : ""}</span>
                  )}
                </td>
                <td className="max-w-xs px-4 py-3 text-ink-soft">{s.message}</td>
                <td className="px-4 py-3">
                  <SubmissionActions id={s.id} status={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
