import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { PageHero } from "@/components/shop/PageHero";
import { BRAND } from "@/lib/brand";
import type { SiteContent } from "@/lib/content-shared";
import { SITE_URL } from "@/lib/env";
import type { LegalData } from "@/lib/settings-shared";
import { getSiteContent, getSettings } from "@/lib/site-data";

export const revalidate = 3600;

type Ctx = { legal: LegalData; contact: SiteContent["contact"] };
type Doc = { title: string; description: string; body: (ctx: Ctx) => ReactNode };

const domain = SITE_URL.replace(/^https?:\/\//, "");

const DOCS: Record<string, Doc> = {
  "aviso-legal": {
    title: "Aviso legal",
    description: `Datos identificativos y condiciones de uso del sitio web de ${BRAND.name}.`,
    body: ({ legal }) => (
      <>
        <h2>Datos identificativos</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este sitio web ({domain}) es titularidad de:
        </p>
        <ul>
          <li>Titular: {legal.razonSocial}</li>
          <li>NIF/CIF: {legal.nif}</li>
          <li>Domicilio: {legal.domicilio}</li>
          <li>Email: {legal.email}</li>
          <li>Teléfono: {legal.telefono}</li>
          {legal.registro && <li>Datos registrales: {legal.registro}</li>}
        </ul>
        <h2>Objeto</h2>
        <p>
          Este sitio web tiene por objeto dar a conocer la floristería {BRAND.name} y permitir la compra online de sus productos. El acceso y uso del sitio atribuye la condición de usuario e implica la aceptación de este aviso legal.
        </p>
        <h2>Propiedad intelectual e industrial</h2>
        <p>
          Los contenidos del sitio (textos, fotografías, diseño, logotipos y código) pertenecen a su titular o a terceros que han autorizado su uso. Queda prohibida su reproducción, distribución o transformación sin autorización expresa.
        </p>
        <h2>Responsabilidad</h2>
        <p>
          El titular no se hace responsable de los daños derivados de un uso indebido del sitio ni de interrupciones técnicas ajenas a su control. Los enlaces a sitios de terceros se ofrecen a título informativo.
        </p>
        <h2>Legislación aplicable</h2>
        <p>Este aviso legal se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan conforme a la normativa de consumidores.</p>
      </>
    ),
  },
  privacidad: {
    title: "Política de privacidad",
    description: `Cómo trata ${BRAND.name} los datos personales de clientes y usuarios.`,
    body: ({ legal }) => (
      <>
        <h2>Responsable del tratamiento</h2>
        <p>
          {legal.razonSocial} · NIF {legal.nif} · {legal.domicilio} · {legal.email}
        </p>
        <h2>Qué datos tratamos y para qué</h2>
        <ul>
          <li>
            <strong>Pedidos:</strong> nombre, email, teléfono y, si hay entrega, los datos de la persona destinataria y la dirección. Los usamos para preparar, entregar y facturar el pedido y para comunicarnos contigo sobre él.
          </li>
          <li>
            <strong>Mensajes de tarjeta y cintas:</strong> el texto que nos pides escribir, solo para preparar el pedido.
          </li>
          <li>
            <strong>Consultas:</strong> los datos que nos facilites al contactarnos, para responderte.
          </li>
        </ul>
        <p>No hacemos perfiles comerciales ni enviamos publicidad sin tu consentimiento.</p>
        <h2>Base jurídica</h2>
        <p>
          La ejecución del contrato de compraventa (art. 6.1.b RGPD) y el cumplimiento de obligaciones legales, fiscales y contables (art. 6.1.c RGPD). Los datos de la persona destinataria se tratan por interés legítimo para poder hacer la entrega que tú nos encargas.
        </p>
        <h2>Conservación</h2>
        <p>Conservamos los datos de los pedidos durante el tiempo exigido por la normativa fiscal y mercantil (con carácter general, 6 años) y después los eliminamos.</p>
        <h2>Destinatarios y encargados</h2>
        <p>No cedemos tus datos a terceros salvo obligación legal. Nos apoyamos en proveedores que tratan datos por nuestra cuenta con las garantías del RGPD:</p>
        <ul>
          <li>Stripe Payments Europe Ltd. — procesamiento de pagos. No tenemos acceso a los datos de tu tarjeta.</li>
          <li>Supabase — alojamiento de la base de datos de pedidos.</li>
          <li>Netlify — alojamiento de la web.</li>
          <li>Resend — envío de los emails de confirmación del pedido.</li>
        </ul>
        <p>
          Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo, amparados en cláusulas contractuales tipo de la Comisión Europea o en el Marco de Privacidad de Datos UE-EE. UU.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {legal.email}. Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).
        </p>
      </>
    ),
  },
  cookies: {
    title: "Política de cookies",
    description: `Información sobre las cookies y el almacenamiento local que usa ${BRAND.name}.`,
    body: () => (
      <>
        <h2>Qué usamos</h2>
        <p>Esta web no utiliza cookies publicitarias ni de analítica. Solo usamos elementos técnicos imprescindibles:</p>
        <ul>
          <li>
            <strong>Carrito de compra</strong> (almacenamiento local del navegador): recuerda los productos que añades. No sale de tu dispositivo.
          </li>
          <li>
            <strong>Sesión del panel de administración</strong>: solo para el personal de la floristería.
          </li>
        </ul>
        <h2>Contenidos de terceros</h2>
        <p>
          La portada muestra un mapa de <strong>Google Maps</strong> para indicar cómo llegar a la tienda; Google puede instalar sus propias cookies según su política de privacidad. El <strong>pago</strong> se realiza en la página segura de Stripe, que aplica su propia política de cookies.
        </p>
        <h2>Cómo gestionarlas</h2>
        <p>Puedes borrar el almacenamiento local y las cookies desde la configuración de tu navegador en cualquier momento.</p>
      </>
    ),
  },
  "condiciones-de-venta": {
    title: "Condiciones de venta",
    description: `Condiciones generales de contratación de la tienda online de ${BRAND.name}: pedidos, precios, pago, entregas y devoluciones.`,
    body: ({ legal, contact }) => (
      <>
        <h2>1. Vendedor</h2>
        <p>
          {legal.razonSocial}, NIF {legal.nif}, con domicilio en {legal.domicilio}. Contacto: {legal.email} · {legal.telefono}.
        </p>
        <h2>2. Proceso de compra</h2>
        <p>
          Añade los productos al carrito, indica tus datos, el método de entrega, la fecha y la franja horaria, y completa el pago. Al confirmarse el pago recibirás un email con el resumen del pedido, que constituye la confirmación del contrato. El contrato se formaliza en español.
        </p>
        <h2>3. Precios</h2>
        <p>
          Los precios se muestran en euros e incluyen el IVA. Los gastos de entrega se indican antes de pagar, según el método elegido. Nos reservamos el derecho a modificar los precios, aplicándose siempre los vigentes en el momento del pedido.
        </p>
        <h2>4. Pago</h2>
        <p>
          El pago se realiza con tarjeta de débito o crédito, Apple Pay o Google Pay a través de Stripe, una pasarela segura. {BRAND.name} no tiene acceso ni almacena los datos de tu tarjeta.
        </p>
        <h2>5. Flor natural</h2>
        <p>
          Trabajamos con flor natural de temporada. Las fotografías son orientativas: cada composición se hace a mano y puede variar ligeramente. Si alguna flor no estuviera disponible, la sustituiremos por otra de igual o superior calidad y valor, respetando el estilo y los colores del producto.
        </p>
        <h2>6. Entregas</h2>
        <ul>
          <li>Repartimos en las zonas y con los precios que se indican en el checkout. También puedes recoger el pedido en la tienda ({contact.address}).</li>
          <li>Entregamos en la fecha y franja horaria elegidas. Los pedidos para el mismo día están sujetos a la hora límite que se muestra al comprar.</li>
          <li>Si la persona destinataria no se encuentra, intentaremos contactar por teléfono y podremos dejar el pedido a un vecino o conserjería, o acordar una nueva entrega, que podría tener coste adicional.</li>
          <li>En tanatorios y centros entregamos en recepción o en la sala indicada.</li>
        </ul>
        <h2>7. Cancelaciones y desistimiento</h2>
        <p>
          Conforme al artículo 103 del Real Decreto Legislativo 1/2007 (TRLGDCU), el derecho de desistimiento no es aplicable a los productos que pueden deteriorarse o caducar con rapidez, como la flor natural y las plantas, ni a los productos personalizados (por ejemplo, coronas con cinta). Aun así, si necesitas cancelar o modificar un pedido, avísanos cuanto antes: si todavía no lo hemos empezado a preparar, te devolveremos el importe íntegro.
        </p>
        <h2>8. Incidencias</h2>
        <p>
          Si el pedido llega en mal estado o no corresponde a lo solicitado, escríbenos en las 24 horas siguientes a la entrega a {legal.email}, a ser posible con una fotografía, y lo repondremos o te devolveremos el importe.
        </p>
        <h2>9. Atención al cliente y reclamaciones</h2>
        <p>
          Puedes contactar con nosotros en {legal.email} o en el {legal.telefono}. Disponemos de hojas de reclamación a disposición de los consumidores. Estas condiciones se rigen por la legislación española.
        </p>
      </>
    ),
  },
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = DOCS[(await params).slug];
  if (!doc) return {};
  return { title: doc.title, description: doc.description, alternates: { canonical: `/legal/${(await params).slug}` } };
}

export default async function LegalPage({ params }: Params) {
  const doc = DOCS[(await params).slug];
  if (!doc) notFound();
  const [settings, content] = await Promise.all([getSettings(), getSiteContent()]);
  return (
    <main id="main">
      <PageHero compact crumbs={[{ href: "/", label: "Inicio" }, { label: doc.title }]} title={doc.title} />
      <section className="section shop" style={{ paddingTop: 70 }}>
        <div className="container">
          <article className="prose">{doc.body({ legal: settings.legal, contact: content.contact })}</article>
        </div>
      </section>
    </main>
  );
}
