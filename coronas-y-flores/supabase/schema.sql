-- ============================================================
-- Coronas y Flores · esquema de la tienda online
-- Pegar entero en Supabase → SQL Editor → Run. Es idempotente.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Administradores ----------
-- No hay registro público: solo los usuarios listados aquí entran al panel.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

drop policy if exists "admin_users: lectura propia" on public.admin_users;
create policy "admin_users: lectura propia" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- Catálogo ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  image_url text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  description text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  price_cents int not null default 0 check (price_cents >= 0),
  compare_at_cents int check (compare_at_cents >= 0),
  stock int check (stock >= 0),            -- null = sin control de stock
  active boolean not null default false,   -- publicado en la tienda
  featured boolean not null default false, -- aparece en la portada
  allow_ribbon boolean not null default false, -- pide texto de cinta (coronas)
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (active, sort_order);
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price_cents int not null check (price_cents >= 0),
  sort_order int not null default 0
);
create index if not exists product_variants_product_idx on public.product_variants (product_id);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  storage_path text,
  alt text not null default '',
  sort_order int not null default 0
);
create index if not exists product_images_product_idx on public.product_images (product_id);

-- ---------- Envíos ----------
create table if not exists public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  kind text not null default 'delivery' check (kind in ('delivery', 'pickup')),
  price_cents int not null default 0 check (price_cents >= 0),
  free_over_cents int check (free_over_cents >= 0),
  postal_codes text[] not null default '{}', -- vacío = cualquier código postal
  active boolean not null default true,
  sort_order int not null default 0
);

-- ---------- Ajustes y contenido editable (una fila cada uno) ----------
create table if not exists public.store_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.site_content (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.store_settings (id) values (1) on conflict (id) do nothing;
insert into public.site_content (id) values (1) on conflict (id) do nothing;

-- ---------- Pedidos ----------
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number bigint not null unique default nextval('public.order_number_seq'),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'preparing', 'ready', 'shipped', 'delivered', 'cancelled')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_method_id uuid references public.shipping_methods(id) on delete set null,
  shipping_kind text not null check (shipping_kind in ('delivery', 'pickup')),
  shipping_name text not null,
  shipping_cents int not null default 0,
  recipient_name text,
  recipient_phone text,
  address text,
  postal_code text,
  city text,
  delivery_date date not null,
  delivery_slot text not null,
  card_message text not null default '',
  notes text not null default '',
  subtotal_cents int not null,
  total_cents int not null,
  stripe_session_id text unique,
  stripe_payment_intent text,
  paid_at timestamptz,
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_delivery_idx on public.orders (delivery_date);
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  unit_price_cents int not null,
  quantity int not null check (quantity > 0),
  ribbon_text text not null default '',
  image_url text
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- Descuenta stock al confirmarse el pago (lo llama el servidor con la service role).
create or replace function public.apply_order_stock(p_order_id uuid)
returns void
language sql security definer
set search_path = public
as $$
  update public.products p
     set stock = greatest(p.stock - s.qty, 0)
    from (
      select product_id, sum(quantity)::int as qty
        from public.order_items
       where order_id = p_order_id and product_id is not null
       group by product_id
    ) s
   where p.id = s.product_id and p.stock is not null;
$$;
revoke execute on function public.apply_order_stock(uuid) from public, anon, authenticated;
grant execute on function public.apply_order_stock(uuid) to service_role;

-- ---------- Row Level Security ----------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.shipping_methods enable row level security;
alter table public.store_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Lectura pública solo de lo publicado
drop policy if exists "categories: lectura" on public.categories;
create policy "categories: lectura" on public.categories
  for select using (active or public.is_admin());
drop policy if exists "products: lectura" on public.products;
create policy "products: lectura" on public.products
  for select using (active or public.is_admin());
drop policy if exists "variants: lectura" on public.product_variants;
create policy "variants: lectura" on public.product_variants
  for select using (
    public.is_admin() or exists (select 1 from public.products p where p.id = product_id and p.active)
  );
drop policy if exists "images: lectura" on public.product_images;
create policy "images: lectura" on public.product_images
  for select using (
    public.is_admin() or exists (select 1 from public.products p where p.id = product_id and p.active)
  );
drop policy if exists "shipping: lectura" on public.shipping_methods;
create policy "shipping: lectura" on public.shipping_methods
  for select using (active or public.is_admin());
drop policy if exists "settings: lectura" on public.store_settings;
create policy "settings: lectura" on public.store_settings for select using (true);
drop policy if exists "content: lectura" on public.site_content;
create policy "content: lectura" on public.site_content for select using (true);

-- El admin puede con todo (pedidos incluidos). Los pedidos de clientes los crea
-- el servidor con la service role, que salta RLS: nadie anónimo escribe aquí.
do $$
declare t text;
begin
  foreach t in array array['categories','products','product_variants','product_images',
                           'shipping_methods','store_settings','site_content','orders','order_items']
  loop
    execute format('drop policy if exists "%1$s: admin" on public.%1$I', t);
    execute format('create policy "%1$s: admin" on public.%1$I for all to authenticated
                    using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Permisos explícitos para la Data API (RLS sigue mandando)
grant usage on schema public to anon, authenticated, service_role;
grant select on public.categories, public.products, public.product_variants, public.product_images,
  public.shipping_methods, public.store_settings, public.site_content to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Storage: fotos ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media: admin lee" on storage.objects;
create policy "media: admin lee" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin sube" on storage.objects;
create policy "media: admin sube" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin actualiza" on storage.objects;
create policy "media: admin actualiza" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin borra" on storage.objects;
create policy "media: admin borra" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ============================================================
-- Último paso (una vez): crea el usuario en Authentication → Users → Add user
-- y dale acceso al panel cambiando el email:
--
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'tu-email@ejemplo.com'
--   on conflict do nothing;
-- ============================================================
