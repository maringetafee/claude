-- ============================================================
-- Datos iniciales (opcional). Categorías, métodos de envío y 8
-- productos DE EJEMPLO con fotos de stock para que la tienda no
-- salga vacía en la demo. La floristería los sustituye desde el panel.
-- Ejecutar después de schema.sql.
-- ============================================================

insert into public.categories (slug, name, description, sort_order) values
  ('ramos', 'Ramos', 'Ramos de temporada compuestos a mano cada mañana en el taller.', 1),
  ('coronas-y-centros-funerarios', 'Coronas y centros funerarios', 'Coronas, centros y palmas para despedir con respeto. Entregamos en tanatorios y parroquias.', 2),
  ('centros-y-detalles', 'Centros y detalles', 'Centros de mesa y detalles florales para regalar o decorar.', 3),
  ('plantas', 'Plantas', 'Plantas de interior con asesoramiento incluido.', 4)
on conflict (slug) do nothing;

insert into public.shipping_methods (name, description, kind, price_cents, free_over_cents, postal_codes, sort_order)
select * from (values
  ('Entrega en Alcorcón', 'Reparto propio. Gratis a partir de 60 €.', 'delivery', 600, 6000,
    array['28920','28921','28922','28923','28924','28925'], 1),
  ('Entrega en municipios cercanos', 'Móstoles, Leganés, Fuenlabrada y Villaviciosa de Odón.', 'delivery', 1200, null,
    array['28931','28932','28933','28934','28935','28936','28937','28938',
          '28911','28912','28913','28914','28915','28916','28917','28918','28919',
          '28941','28942','28943','28944','28945','28946','28947','28670'], 2),
  ('Recogida en tienda', 'C. Múnich, Pl. de Ondarreta, 6, Local 43 · Alcorcón', 'pickup', 0, null, array[]::text[], 3)
) as v(name, description, kind, price_cents, free_over_cents, postal_codes, sort_order)
where not exists (select 1 from public.shipping_methods);

-- Productos de ejemplo
insert into public.products (slug, name, short_description, description, category_id, price_cents, active, featured, allow_ribbon, sort_order)
select v.slug, v.name, v.short_description, v.description, c.id, v.price_cents, true, v.featured, v.allow_ribbon, v.sort_order
from (values
  ('ramo-de-temporada', 'Ramo de temporada', 'La flor más fresca de la semana, compuesta a mano.',
   'Cada ramo es único: elegimos la flor que llega fresca del mercado esa misma mañana y la combinamos con follaje de temporada. Se entrega envuelto en papel kraft con agua para el trayecto.',
   'ramos', 2500, true, false, 1),
  ('ramo-arcoiris', 'Ramo arcoíris', 'Rosas multicolor para regalar alegría.',
   'Un ramo lleno de color con rosas de distintos tonos. Ideal para cumpleaños, aniversarios o para decir "porque sí".',
   'ramos', 3900, true, false, 2),
  ('tulipanes-blancos', 'Tulipanes blancos', 'Frescura y luz para el salón.',
   'Manojo de tulipanes blancos con un toque de verde. Sencillo, elegante y siempre acertado.',
   'ramos', 3200, true, false, 3),
  ('corona-funeraria-clasica', 'Corona funeraria clásica', 'Corona de flor blanca con cinta personalizada.',
   'Corona tradicional de flor natural en tonos blancos. Incluye cinta con el texto que nos indiques. Entregamos directamente en el tanatorio.',
   'coronas-y-centros-funerarios', 12000, true, true, 1),
  ('centro-funerario-lirios', 'Centro funerario de lirios', 'Centro de lirios y rosas para el velatorio.',
   'Centro de flor natural con lirios y rosas, pensado para el velatorio o la ceremonia. Incluye cinta personalizada.',
   'coronas-y-centros-funerarios', 8500, false, true, 2),
  ('centro-silvestre', 'Centro silvestre', 'Composición de aire natural y libre.',
   'Centro de mesa con flor silvestre y espigas. Perfecto para una comida especial o para dar vida a la entrada de casa.',
   'centros-y-detalles', 4500, false, false, 1),
  ('detalle-corazon', 'Detalle corazón', 'Pequeña pieza floral para una ocasión especial.',
   'Composición en forma de corazón, un detalle con cariño para San Valentín, aniversarios o el Día de la Madre.',
   'centros-y-detalles', 2900, false, false, 2),
  ('suculenta-en-maceta', 'Suculenta en maceta', 'Planta de interior de bajo mantenimiento.',
   'Suculenta en maceta de cerámica blanca. Necesita luz indirecta y muy poco riego. Te explicamos sus cuidados.',
   'plantas', 1800, false, false, 1)
) as v(slug, name, short_description, description, category_slug, price_cents, featured, allow_ribbon, sort_order)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

-- Variantes (tamaños)
insert into public.product_variants (product_id, name, price_cents, sort_order)
select p.id, v.name, v.price_cents, v.sort_order
from (values
  ('ramo-de-temporada', 'Pequeño', 2500, 1),
  ('ramo-de-temporada', 'Mediano', 3500, 2),
  ('ramo-de-temporada', 'Grande', 4900, 3),
  ('corona-funeraria-clasica', '60 cm', 12000, 1),
  ('corona-funeraria-clasica', '80 cm', 16000, 2),
  ('corona-funeraria-clasica', '100 cm', 21000, 3)
) as v(slug, name, price_cents, sort_order)
join public.products p on p.slug = v.slug
where not exists (select 1 from public.product_variants pv where pv.product_id = p.id);

-- Imágenes (las mismas fotos de stock que usa la plantilla)
insert into public.product_images (product_id, url, alt, sort_order)
select p.id, v.url, v.alt, v.sort_order
from (values
  ('ramo-de-temporada', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1400&q=80', 'Ramo de temporada con rosa rosa en jarrón', 1),
  ('ramo-de-temporada', 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1400&q=80', 'Ramo frondoso con rosas y follaje', 2),
  ('ramo-arcoiris', 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1400&q=80', 'Ramo de rosas multicolor', 1),
  ('tulipanes-blancos', 'https://images.unsplash.com/photo-1462530260150-162092dbf011?auto=format&fit=crop&w=1400&q=80', 'Tulipanes blancos en jarrón sobre mesa de madera', 1),
  ('corona-funeraria-clasica', 'https://images.unsplash.com/photo-1495231916356-a86217efff12?auto=format&fit=crop&w=1400&q=80', 'Rosa blanca en primer plano', 1),
  ('centro-funerario-lirios', 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?auto=format&fit=crop&w=1400&q=80', 'Lirio en jarrón de cristal', 1),
  ('centro-silvestre', 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1400&q=80', 'Amapolas en campo de trigo', 1),
  ('detalle-corazon', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1400&q=80', 'Composición floral en forma de corazón', 1),
  ('suculenta-en-maceta', 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=1400&q=80', 'Suculenta en maceta blanca', 1)
) as v(slug, url, alt, sort_order)
join public.products p on p.slug = v.slug
where not exists (select 1 from public.product_images pi where pi.product_id = p.id);
