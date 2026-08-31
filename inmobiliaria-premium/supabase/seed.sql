-- Inmo Retail — datos de ejemplo
-- Migra las 6 propiedades que hoy viven hardcodeadas en src/lib/config.ts a
-- la base de datos real. Ejecuta esto DESPUÉS de supabase/schema.sql, en el
-- mismo SQL Editor. Es seguro volver a ejecutarlo (usa ON CONFLICT DO NOTHING
-- sobre el slug, así que si ya migraste no duplicará filas).

-- 1) Ático con terraza en El Bercial
with p as (
  insert into public.properties (
    reference, slug, title, description, type, operation, price,
    address, city, zone, postal_code, latitude, longitude,
    area, beds, baths, floor, year, state, features, featured, showcase, published
  ) values (
    'IR-1001', 'atico-el-bercial-getafe', 'Ático con terraza en El Bercial',
    'Un ático reformado con criterio en El Bercial, uno de los desarrollos más recientes de Getafe. La terraza envuelve el salón y se abre a una panorámica despejada que cambia con la luz del día. Interiores en tonos cálidos, techos altos y una distribución pensada para vivir puertas afuera.',
    'Ático', 'venta', 335000,
    null, 'Madrid', 'Getafe', '28905', 40.3097, -3.7357,
    108, 3, 2, null, 2023, 'Reformado',
    array['Terraza de 40 m²','Orientación sur','Aire acondicionado por conductos','Plaza de garaje incluida','Urbanización con zonas comunes','Reformado en 2023'],
    true, false, true
  )
  on conflict (slug) do nothing
  returning id
)
insert into public.property_images (property_id, url, alt, position, is_cover)
select id, url, alt, position, position = 0
from p, (values
  ('https://images.unsplash.com/photo-1776363284806-873eeef565a7?auto=format&fit=crop&q=80', 'Terraza del ático al atardecer', 0),
  ('https://images.unsplash.com/photo-1776363116182-51694a04a1d5?auto=format&fit=crop&q=80', 'Balcón con vistas abiertas', 1),
  ('https://images.unsplash.com/photo-1724582586529-62622e50c0b3?auto=format&fit=crop&q=80', 'Salón luminoso con ventanal', 2),
  ('https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?auto=format&fit=crop&q=80', 'Zona de estar del ático', 3)
) as g(url, alt, position);

-- 2) Chalet Los Cerezos (propiedad protagonista)
with p as (
  insert into public.properties (
    reference, slug, title, description, type, operation, price,
    address, city, zone, postal_code, latitude, longitude,
    area, beds, baths, floor, year, state, features, featured, showcase, published
  ) values (
    'IR-1002', 'chalet-los-cerezos-el-bercial', 'Chalet Los Cerezos',
    'Una propiedad singular en la zona residencial de El Bercial, en Getafe, concebida para la vida en gran formato: cinco habitaciones, jardín maduro, piscina climatizada y una cocina abierta que hace de centro de la casa. La luz entra por todas partes gracias a los grandes ventanales que enmarcan el jardín.',
    'Villa', 'venta', 860000,
    null, 'Madrid', 'Getafe', '28905', 40.3027, -3.7287,
    380, 5, 4, null, null, 'Buen estado',
    array['Parcela de 500 m²','Piscina climatizada','Bodega climatizada','Domótica integral','Garaje para 3 vehículos','Urbanización cerrada'],
    true, true, true
  )
  on conflict (slug) do nothing
  returning id
)
insert into public.property_images (property_id, url, alt, position, is_cover)
select id, url, alt, position, position = 0
from p, (values
  ('https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&q=80', 'Fachada y piscina del chalet', 0),
  ('https://images.unsplash.com/photo-1748063578185-3d68121b11ff?auto=format&fit=crop&q=80', 'Chalet iluminado al anochecer', 1),
  ('https://images.unsplash.com/photo-1682888813913-e13f18692019?auto=format&fit=crop&q=80', 'Cocina con isla de mármol', 2),
  ('https://images.unsplash.com/photo-1638886043487-72d203fa66b6?auto=format&fit=crop&q=80', 'Cocina con taburetes de bar', 3),
  ('https://images.unsplash.com/photo-1717167398817-121e3c283dbb?auto=format&fit=crop&q=80', 'Vista general del chalet y su jardín', 4)
) as g(url, alt, position);

-- 3) Loft industrial en Carabanchel (alquiler)
with p as (
  insert into public.properties (
    reference, slug, title, description, type, operation, price, price_suffix,
    address, city, zone, postal_code, latitude, longitude,
    area, beds, baths, floor, year, state, features, featured, showcase, published
  ) values (
    'IR-1003', 'loft-carabanchel', 'Loft industrial en Carabanchel',
    'Un loft con carácter cerca de Madrid Río, en un Carabanchel que se reinventa barrio a barrio. Techos altos, vigas vistas y una distribución diáfana que aprovecha cada metro, pensado para quien busca vivir bien conectado sin renunciar al espacio.',
    'Loft', 'alquiler', 980, '/mes',
    null, 'Madrid', 'Carabanchel', '28025', 40.3858, -3.7411,
    68, 1, 1, null, null, 'Buen estado',
    array['Techos de 3,4 m','Suelo de microcemento','Cocina americana equipada','Amueblado','Ascensor','Se aceptan mascotas'],
    false, false, true
  )
  on conflict (slug) do nothing
  returning id
)
insert into public.property_images (property_id, url, alt, position, is_cover)
select id, url, alt, position, position = 0
from p, (values
  ('https://images.unsplash.com/photo-1724582586458-a51791349977?auto=format&fit=crop&q=80', 'Salón del loft', 0),
  ('https://images.unsplash.com/photo-1691036561870-e2badbd0fd22?auto=format&fit=crop&q=80', 'Zona de estar con sofá amarillo', 1),
  ('https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&q=80', 'Rincón de lectura del loft', 2)
) as g(url, alt, position);

-- 4) Dúplex con terraza en Alcorcón
with p as (
  insert into public.properties (
    reference, slug, title, description, type, operation, price,
    address, city, zone, postal_code, latitude, longitude,
    area, beds, baths, floor, year, state, features, featured, showcase, published
  ) values (
    'IR-1004', 'duplex-alcorcon', 'Dúplex con terraza en Alcorcón',
    'Un dúplex reformado de arriba abajo en una de las calles más tranquilas de Parque Oeste, Alcorcón. La planta superior se resuelve en una terraza privada de uso exclusivo, ideal para comidas al aire libre y las noches de verano.',
    'Dúplex', 'venta', 259000,
    null, 'Madrid', 'Alcorcón', '28925', 40.3489, -3.830,
    110, 3, 2, null, 2022, 'Reformado',
    array['Terraza privada de 18 m²','Reformado en 2022','Suelo radiante','Trastero incluido','Zona tranquila y bien comunicada','Certificación energética B'],
    false, false, true
  )
  on conflict (slug) do nothing
  returning id
)
insert into public.property_images (property_id, url, alt, position, is_cover)
select id, url, alt, position, position = 0
from p, (values
  ('https://images.unsplash.com/photo-1722421492323-eaf9c401befe?auto=format&fit=crop&q=80', 'Fachada del edificio', 0),
  ('https://images.unsplash.com/photo-1571843439991-dd2b8e051966?auto=format&fit=crop&q=80', 'Cocina con isla', 1),
  ('https://images.unsplash.com/photo-1613545564259-ede280773613?auto=format&fit=crop&q=80', 'Comedor con mesa de madera', 2)
) as g(url, alt, position);

-- 5) Piso reformado junto al parque de Polvoranca (Leganés)
with p as (
  insert into public.properties (
    reference, slug, title, description, type, operation, price,
    address, city, zone, postal_code, latitude, longitude,
    area, beds, baths, floor, year, state, features, featured, showcase, published
  ) values (
    'IR-1005', 'piso-leganes', 'Piso reformado junto al parque de Polvoranca',
    'A un paseo del parque de Polvoranca, en Leganés, un piso familiar reformado con materiales nobles y una luz envidiable durante todo el día. Distribución clásica puesta al día, con habitaciones amplias y un salón que da a la calle.',
    'Piso', 'venta', 275000,
    null, 'Madrid', 'Leganés', '28914', 40.3251, -3.7605,
    132, 4, 2, null, null, 'Reformado',
    array['Finca reformada por completo','Suelos de madera maciza','Armarios empotrados','Portería y ascensor','Plaza de garaje opcional','A 5 minutos del parque de Polvoranca'],
    false, false, true
  )
  on conflict (slug) do nothing
  returning id
)
insert into public.property_images (property_id, url, alt, position, is_cover)
select id, url, alt, position, position = 0
from p, (values
  ('https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?auto=format&fit=crop&q=80', 'Salón principal', 0),
  ('https://images.unsplash.com/photo-1663811397219-c572550dffc5?auto=format&fit=crop&q=80', 'Zona de estar con televisión', 1),
  ('https://images.unsplash.com/photo-1649083048770-82e8ffd80431?auto=format&fit=crop&q=80', 'Salón con chimenea', 2)
) as g(url, alt, position);

-- 6) Chalet adosado en Parque Oeste (Alcorcón)
with p as (
  insert into public.properties (
    reference, slug, title, description, type, operation, price,
    address, city, zone, postal_code, latitude, longitude,
    area, beds, baths, floor, year, state, features, featured, showcase, published
  ) values (
    'IR-1006', 'chalet-parque-oeste-alcorcon', 'Chalet adosado en Parque Oeste',
    'Chalet adosado de líneas contemporáneas en una de las zonas más solicitadas de Alcorcón. Jardín orientado a poniente, piscina y una planta baja diáfana que conecta el salón, la cocina y el porche exterior en un único espacio de vida.',
    'Chalet', 'venta', 590000,
    null, 'Madrid', 'Alcorcón', '28925', 40.3419, -3.823,
    310, 4, 3, null, null, 'Buen estado',
    array['Parcela de 400 m²','Porche cubierto','Cocina office','Estudio independiente','Colegios concertados cercanos','A 20 minutos del centro de Madrid'],
    false, false, true
  )
  on conflict (slug) do nothing
  returning id
)
insert into public.property_images (property_id, url, alt, position, is_cover)
select id, url, alt, position, position = 0
from p, (values
  ('https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80', 'Fachada y piscina', 0),
  ('https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?auto=format&fit=crop&q=80', 'Zona de piscina', 1),
  ('https://images.unsplash.com/photo-1670589953903-b4e2f17a70a9?auto=format&fit=crop&q=80', 'Vista del jardín y la piscina', 2),
  ('https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?auto=format&fit=crop&q=80', 'Chalet con tumbonas junto a la piscina', 3)
) as g(url, alt, position);
