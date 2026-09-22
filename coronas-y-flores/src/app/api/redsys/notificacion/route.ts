import { processRedsysResponse } from "@/lib/orders";

// Notificación "online" de Redsys (servidor a servidor) al terminar cada pago.
// Es la confirmación fiable: llega aunque el cliente cierre la ventana.
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response("Petición no válida", { status: 400 });
  }
  const outcome = await processRedsysResponse(
    form.get("Ds_MerchantParameters")?.toString(),
    form.get("Ds_Signature")?.toString(),
    { revalidate: true },
  );
  if (outcome.kind === "invalid") return new Response("KO", { status: 400 });
  return new Response("OK");
}
