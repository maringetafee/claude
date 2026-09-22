import "server-only";
import { createCipheriv, createHmac, randomInt, timingSafeEqual } from "node:crypto";

// TPV Virtual de Redsys por redirección, firma HMAC_SHA256_V1.
// Sin credenciales propias se usa el comercio de pruebas público de Redsys:
// la tienda funciona de principio a fin pero no se cobra nada.

export type RedsysConfig = {
  merchantCode: string;
  terminal: string;
  secretKey: string;
  live: boolean;
  /** true si faltan las credenciales del banco y se usa el comercio de pruebas */
  usingTestCredentials: boolean;
  url: string;
};

const TEST_MERCHANT = { merchantCode: "999008881", terminal: "1", secretKey: "sq7HjrUOBfKmC576ILgskD5srU870gJ7" };
const URLS = {
  test: "https://sis-t.redsys.es:25443/sis/realizarPago",
  live: "https://sis.redsys.es/sis/realizarPago",
};

export function getRedsysConfig(): RedsysConfig | null {
  const live = (process.env.REDSYS_ENV ?? "").trim().toLowerCase() === "live";
  const merchantCode = process.env.REDSYS_MERCHANT_CODE?.trim();
  const terminal = process.env.REDSYS_TERMINAL?.trim() || "1";
  const secretKey = process.env.REDSYS_SECRET_KEY?.trim();

  if (merchantCode && secretKey) {
    return { merchantCode, terminal, secretKey, live, usingTestCredentials: false, url: live ? URLS.live : URLS.test };
  }
  // En real nunca se cae al comercio de pruebas: mejor no vender que "vender" sin cobrar.
  if (live) return null;
  return { ...TEST_MERCHANT, live: false, usingTestCredentials: true, url: URLS.test };
}

const b64urlToB64 = (s: string) => s.replace(/-/g, "+").replace(/_/g, "/");

function orderKey(secretKey: string, order: string): Buffer {
  const key = Buffer.from(secretKey, "base64");
  const data = Buffer.from(order, "utf8");
  const padded = Buffer.alloc(Math.ceil(data.length / 8) * 8, 0);
  data.copy(padded);
  const cipher = createCipheriv("des-ede3-cbc", key, Buffer.alloc(8, 0));
  cipher.setAutoPadding(false);
  return Buffer.concat([cipher.update(padded), cipher.final()]);
}

function sign(secretKey: string, order: string, merchantParameters: string): Buffer {
  return createHmac("sha256", orderKey(secretKey, order)).update(merchantParameters).digest();
}

/** Número de operación: 4 cifras + 8 alfanuméricos, único por intento de pago. */
export function newRedsysOrder(orderNumber: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 8; i++) suffix += chars[randomInt(chars.length)];
  return `${String(orderNumber % 10000).padStart(4, "0")}${suffix}`;
}

export type PaymentRequest = {
  order: string;
  amountCents: number;
  description: string;
  holder: string;
  merchantName: string;
  notifyUrl: string;
  okUrl: string;
  koUrl: string;
  method: "card" | "bizum";
};

export type RedsysForm = {
  url: string;
  fields: { Ds_SignatureVersion: string; Ds_MerchantParameters: string; Ds_Signature: string };
};

export function buildPaymentForm(cfg: RedsysConfig, req: PaymentRequest): RedsysForm {
  const params: Record<string, string> = {
    DS_MERCHANT_AMOUNT: String(req.amountCents),
    DS_MERCHANT_ORDER: req.order,
    DS_MERCHANT_MERCHANTCODE: cfg.merchantCode,
    DS_MERCHANT_CURRENCY: "978",
    DS_MERCHANT_TRANSACTIONTYPE: "0",
    DS_MERCHANT_TERMINAL: cfg.terminal,
    DS_MERCHANT_MERCHANTURL: req.notifyUrl,
    DS_MERCHANT_URLOK: req.okUrl,
    DS_MERCHANT_URLKO: req.koUrl,
    DS_MERCHANT_PRODUCTDESCRIPTION: req.description.slice(0, 125),
    DS_MERCHANT_TITULAR: req.holder.slice(0, 60),
    DS_MERCHANT_MERCHANTNAME: req.merchantName.slice(0, 25),
    DS_MERCHANT_CONSUMERLANGUAGE: "001",
  };
  if (req.method === "bizum") params.DS_MERCHANT_PAYMETHODS = "z";
  const merchantParameters = Buffer.from(JSON.stringify(params), "utf8").toString("base64");
  return {
    url: cfg.url,
    fields: {
      Ds_SignatureVersion: "HMAC_SHA256_V1",
      Ds_MerchantParameters: merchantParameters,
      Ds_Signature: sign(cfg.secretKey, req.order, merchantParameters).toString("base64"),
    },
  };
}

export type RedsysResult = {
  order: string;
  amountCents: number;
  response: number;
  authorised: boolean;
  authCode: string | null;
  cardBrand: string | null;
  cardCountry: string | null;
  payMethod: string | null;
};

/**
 * Verifica la firma de una respuesta de Redsys (notificación o vuelta a URLOK)
 * y devuelve sus datos. null si la firma no cuadra.
 */
export function verifyResponse(
  cfg: RedsysConfig,
  merchantParameters: string | null | undefined,
  signature: string | null | undefined,
): RedsysResult | null {
  if (!merchantParameters || !signature) return null;
  let data: Record<string, string>;
  try {
    data = JSON.parse(Buffer.from(b64urlToB64(merchantParameters), "base64").toString("utf8"));
  } catch {
    return null;
  }
  const get = (k: string) => data[k] ?? data[k.toUpperCase()] ?? null;
  const order = get("Ds_Order");
  if (!order) return null;

  const expected = sign(cfg.secretKey, decodeURIComponent(order), merchantParameters);
  const received = Buffer.from(b64urlToB64(signature), "base64");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

  const response = Number.parseInt(get("Ds_Response") ?? "", 10);
  return {
    order: decodeURIComponent(order),
    amountCents: Number.parseInt(get("Ds_Amount") ?? "0", 10),
    response,
    authorised: Number.isFinite(response) && response >= 0 && response <= 99,
    authCode: get("Ds_AuthorisationCode")?.trim() || null,
    cardBrand: get("Ds_Card_Brand"),
    cardCountry: get("Ds_Card_Country"),
    payMethod: get("Ds_ProcessedPayMethod"),
  };
}

const BRANDS: Record<string, string> = { "1": "Visa", "2": "Mastercard", "6": "Diners", "7": "Privada", "8": "Amex", "9": "JCB", "22": "UPI" };

export function describePayment(r: RedsysResult): string {
  const parts = [r.payMethod === "68" ? "Bizum" : r.cardBrand ? BRANDS[r.cardBrand] ?? `Tarjeta (${r.cardBrand})` : "Tarjeta"];
  if (r.cardCountry && r.cardCountry !== "724") parts.push(`país ${r.cardCountry}`);
  parts.push(`respuesta ${String(r.response).padStart(4, "0")}`);
  return parts.join(" · ");
}
