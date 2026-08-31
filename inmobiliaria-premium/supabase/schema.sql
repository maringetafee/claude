-- Inmo Retail — esquema de base de datos
-- Pega este archivo completo en el SQL Editor de tu proyecto de Supabase
-- (supabase.com -> tu proyecto -> SQL Editor -> New query -> Run).
-- Es seguro volver a ejecutarlo: usa IF NOT EXISTS / OR REPLACE donde aplica.

-- ============================================================
-- 1. Tabla de propiedades
-- ============================================================
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  slug text not null unique,
  title text not null,
  description text not null default '',
  type text not null default 'Piso',
  operation text not null default 'venta' check (operation in ('venta', 'alquiler')),
  price numeric not null default 0,
  price_suffix text,
  address text,
  city text not null default 'Madrid',
  zone text not null,
  postal_code text,
  latitude double precision not null,
  longitude double precision not null,
  area numeric not null default 0,
  beds integer not null default 0,
  baths integer not null default 0,
  floor text,
  year integer,
  state text,
  features text[] not null default '{}',
  featured boolean not null default false,
  showcase boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_published_idx on public.properties (published);
create index if not exists properties_operation_idx on public.properties (operation);
create index if not exists properties_zone_idx on public.properties (zone);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ============================================================
-- 2. Imágenes de propiedades
-- ============================================================
create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  url text not null,
  alt text not null default '',
  position integer not null default 0,
  is_cover boolean not null default false
);

create index if not exists property_images_property_id_idx on public.property_images (property_id);

-- ============================================================
-- 3. Mensajes de contacto (leads)
-- ============================================================
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties (id) on delete set null,
  property_title text,
  property_reference text,
  name text not null,
  surname text,
  email text not null,
  phone text not null,
  message text not null,
  reason text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx on public.contact_submissions (created_at desc);

-- ============================================================
-- 4. Row Level Security
-- ============================================================
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.contact_submissions enable row level security;

-- Propiedades: cualquiera puede leer las publicadas; solo el admin logueado
-- (cualquier usuario autenticado — no hay registro público, ver nota en el
-- plan) puede leer/crear/editar/borrar todas.
drop policy if exists "public read published properties" on public.properties;
create policy "public read published properties" on public.properties
  for select to anon using (published = true);

drop policy if exists "admin full access properties" on public.properties;
create policy "admin full access properties" on public.properties
  for all to authenticated using (true) with check (true);

-- Imágenes: lectura pública (son fotos de marketing), escritura solo admin.
drop policy if exists "public read property images" on public.property_images;
create policy "public read property images" on public.property_images
  for select to anon using (true);

drop policy if exists "admin full access property images" on public.property_images;
create policy "admin full access property images" on public.property_images
  for all to authenticated using (true) with check (true);

-- Mensajes de contacto: cualquiera puede crear (formulario público), solo
-- el admin puede leer/gestionar.
drop policy if exists "public insert contact submissions" on public.contact_submissions;
create policy "public insert contact submissions" on public.contact_submissions
  for insert to anon with check (true);

drop policy if exists "admin full access contact submissions" on public.contact_submissions;
create policy "admin full access contact submissions" on public.contact_submissions
  for all to authenticated using (true) with check (true);

-- authenticated también necesita SELECT/INSERT/UPDATE en property_images y
-- properties para el panel admin, y SELECT en contact_submissions -- ya
-- cubierto arriba por las políticas "for all".

-- ============================================================
-- 5. Storage: bucket para imágenes de propiedades
-- ============================================================
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "public read property-images bucket" on storage.objects;
create policy "public read property-images bucket" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'property-images');

drop policy if exists "admin write property-images bucket" on storage.objects;
create policy "admin write property-images bucket" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "admin update property-images bucket" on storage.objects;
create policy "admin update property-images bucket" on storage.objects
  for update to authenticated
  using (bucket_id = 'property-images');

drop policy if exists "admin delete property-images bucket" on storage.objects;
create policy "admin delete property-images bucket" on storage.objects
  for delete to authenticated
  using (bucket_id = 'property-images');
