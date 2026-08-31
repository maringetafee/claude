import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ContactPayload {
  propertyId?: string;
  propertyName?: string;
  propertyReference?: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  message?: string;
  reason?: string;
}

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !phone || !message || !isValidEmail(email)) {
    return NextResponse.json({ error: "Datos incompletos o inválidos" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    property_id: body.propertyId || null,
    property_title: body.propertyName || null,
    property_reference: body.propertyReference || null,
    name,
    surname: body.surname?.trim() || null,
    email,
    phone,
    message,
    reason: body.reason || null,
  });

  if (error) {
    console.error("No se pudo guardar el mensaje de contacto:", error.message);
    return NextResponse.json({ error: "No se pudo guardar el mensaje" }, { status: 500 });
  }

  // Punto de extensión para notificaciones por email al equipo comercial.
  // El lead ya queda guardado de forma real en contact_submissions (visible en
  // /admin/mensajes) aunque no haya un proveedor de email configurado todavía.
  if (process.env.RESEND_API_KEY) {
    // await sendLeadNotificationEmail({ name, email, phone, message, propertyName: body.propertyName });
  }

  return NextResponse.json({ ok: true });
}
