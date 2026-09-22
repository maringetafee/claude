-- ============================================================
-- Coronas y Flores · migración 002
-- Redsys (en lugar de Stripe), cuentas de cliente, ofertas y textos por producto.
-- Pegar entero en Supabase → SQL Editor → Run. Es idempotente.
-- ============================================================

-- ---------- Ofertas y textos por producto ----------
alter table public.products add column if not exists discount_percent int not null default 0;
alter table public.products add column if not exists sale_label text not null default '';
alter table public.products add column if not exists sale_starts_on date;
alter table public.products add column if not exists sale_ends_on date;
alter table public.products add column if not exists texts jsonb not null default '{}'::jsonb;
do $$ begin
  alter table public.products add constraint products_discount_range check (discount_percent between 0 and 90);
exception when duplicate_object then null; end $$;

alter table public.order_items add column if not exists original_unit_price_cents int;

-- ---------- Pago con Redsys ----------
alter table public.orders add column if not exists payment_provider text not null default 'redsys';
alter table public.orders add column if not exists payment_method text;          -- card | bizum
alter table public.orders add column if not exists redsys_order text;            -- Ds_Order del último intento
alter table public.orders add column if not exists payment_auth_code text;       -- Ds_AuthorisationCode
alter table public.orders add column if not exists payment_details text;         -- tarjeta / país / respuesta
create unique index if not exists orders_redsys_order_idx on public.orders (redsys_order) where redsys_order is not null;

-- ---------- Cuentas de cliente ----------
create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  phone text not null default '',
  address text not null default '',
  postal_code text not null default '',
  city text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists customers_touch on public.customers;
create trigger customers_touch before update on public.customers
  for each row execute function public.touch_updated_at();
alter table public.customers enable row level security;

alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

-- Cada cliente ve y edita solo su ficha; el admin, todas.
drop policy if exists "customers: propio" on public.customers;
create policy "customers: propio" on public.customers
  for select to authenticated using (id = auth.uid());
drop policy if exists "customers: editar propio" on public.customers;
create policy "customers: editar propio" on public.customers
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "customers: admin" on public.customers;
create policy "customers: admin" on public.customers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Cada cliente ve sus propios pedidos (solo lectura: los crea el servidor).
drop policy if exists "orders: propios" on public.orders;
create policy "orders: propios" on public.orders
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "order_items: propios" on public.order_items;
create policy "order_items: propios" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

grant select, insert, update, delete on public.customers to authenticated;
grant all on public.customers to service_role;

-- ---------- Ofertas de ejemplo en el catálogo de muestra ----------
-- Solo toca productos que aún no tienen oferta. Se cambian o quitan desde
-- el panel → Productos → Oferta. Las coronas y centros funerarios, sin oferta.
update public.products set discount_percent = 20, sale_label = 'Oferta'          where slug = 'ramo-arcoiris'       and discount_percent = 0;
update public.products set discount_percent = 15, sale_label = 'Temporada'       where slug = 'tulipanes-blancos'   and discount_percent = 0;
update public.products set discount_percent = 10, sale_label = 'Temporada'       where slug = 'ramo-de-temporada'   and discount_percent = 0;
update public.products set discount_percent = 25, sale_label = 'Para regalar'    where slug = 'detalle-corazon'     and discount_percent = 0;
update public.products set discount_percent = 30, sale_label = 'Oferta'          where slug = 'suculenta-en-maceta' and discount_percent = 0;
update public.products set discount_percent = 15, sale_label = 'Oferta'          where slug = 'centro-silvestre'    and discount_percent = 0;
