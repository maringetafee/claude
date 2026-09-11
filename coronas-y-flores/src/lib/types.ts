export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  active: boolean;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  storage_path: string | null;
  alt: string;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  price_cents: number;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  category_id: string | null;
  price_cents: number;
  compare_at_cents: number | null;
  stock: number | null;
  active: boolean;
  featured: boolean;
  allow_ribbon: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  category: Pick<Category, "id" | "slug" | "name"> | null;
  images: ProductImage[];
  variants: ProductVariant[];
};

export type ShippingKind = "delivery" | "pickup";

export type ShippingMethod = {
  id: string;
  name: string;
  description: string;
  kind: ShippingKind;
  price_cents: number;
  free_over_cents: number | null;
  postal_codes: string[];
  active: boolean;
  sort_order: number;
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "preparing"
  | "ready"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  unit_price_cents: number;
  quantity: number;
  ribbon_text: string;
  image_url: string | null;
};

export type Order = {
  id: string;
  number: number;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_method_id: string | null;
  shipping_kind: ShippingKind;
  shipping_name: string;
  shipping_cents: number;
  recipient_name: string | null;
  recipient_phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  delivery_date: string;
  delivery_slot: string;
  card_message: string;
  notes: string;
  subtotal_cents: number;
  total_cents: number;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  paid_at: string | null;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
};
