-- ============================================================
-- SCRIPT DE CONFIGURACIÓN DE SUPABASE
-- El Palacio del Pollo
-- ============================================================
-- Copia TODO este texto y pégalo en el Editor SQL de Supabase
-- Haz clic en "Run" y se crearán todas las tablas automáticamente
-- ============================================================


-- TABLA 1: Categorías del menú
-- ============================
CREATE TABLE IF NOT EXISTS categories (
  id            SERIAL PRIMARY KEY,           -- ID único automático (1, 2, 3...)
  name          TEXT NOT NULL,                -- Nombre: "Pollos", "Entrantes"...
  slug          TEXT NOT NULL UNIQUE,         -- URL amigable: "pollos", "entrantes"
  description   TEXT,                         -- Descripción opcional
  display_order INTEGER NOT NULL DEFAULT 0,   -- Orden de aparición
  created_at    TIMESTAMPTZ DEFAULT NOW()     -- Fecha de creación (automática)
);


-- TABLA 2: Platos del menú
-- ========================
CREATE TABLE IF NOT EXISTS menu_items (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL,       -- Precio con 2 decimales (ej: 12.50)
  category_id   INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  image_url     TEXT,                          -- URL de la foto del plato
  available     BOOLEAN NOT NULL DEFAULT TRUE, -- ¿Disponible hoy?
  featured      BOOLEAN NOT NULL DEFAULT FALSE,-- ¿Aparece en la home?
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- TABLA 3: Reservas
-- =================
CREATE TABLE IF NOT EXISTS reservations (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  date       DATE NOT NULL,
  time       TIME NOT NULL,
  guests     INTEGER NOT NULL CHECK (guests > 0),  -- Al menos 1 persona
  notes      TEXT,
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- TABLA 4: Encargos para llevar
-- ==============================
CREATE TABLE IF NOT EXISTS encargos (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,                           -- Opcional, para email de confirmación
  date       DATE NOT NULL,
  time       TEXT NOT NULL,
  notes      TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- TABLA 5: Mensajes de contacto
-- ==============================
CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- PERMISOS (Row Level Security - RLS)
-- ============================================================
-- RLS es el "portero" de tu base de datos.
-- Sin esto, cualquiera podría leer/modificar tus datos.
--
-- NOTA IMPORTANTE sobre service_role:
--   El service_role de Supabase *bypassea RLS por definición* — no necesita
--   políticas propias. Las políticas aquí solo controlan accesos de la
--   anon key (formularios públicos) y authenticated (no usado en este proyecto).
--   El servidor (Next.js) usa service_role → acceso total a todas las tablas.

-- Activar RLS en todas las tablas
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE encargos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages   ENABLE ROW LEVEL SECURITY;

-- ── Acceso público (anon key) ────────────────────────────────

-- Menú: solo lectura pública
CREATE POLICY "Categorías públicas" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Platos públicos" ON menu_items
  FOR SELECT USING (true);

-- Formularios: cualquiera puede INSERTAR (pero NO leer ni modificar)
CREATE POLICY "Crear reserva pública" ON reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Crear encargo público" ON encargos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Crear mensaje público" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- ── Bloqueo explícito de lectura para anon ───────────────────
-- El service_role (servidor) bypasea RLS y puede leer todo.
-- La anon key NO tiene política SELECT → no puede leer nada de estas tablas.
-- Este comentario documenta ese comportamiento intencional.
-- Si en el futuro añades auth de usuarios, crea aquí las políticas correspondientes.


-- ============================================================
-- DATOS INICIALES DE EJEMPLO
-- ============================================================
-- Estos datos aparecerán en tu menú desde el primer día

INSERT INTO categories (name, slug, display_order) VALUES
  ('Pollos',       'pollos',       1),
  ('Entrantes',    'entrantes',    2),
  ('Ensaladas',    'ensaladas',    3),
  ('Guarniciones', 'guarniciones', 4),
  ('Postres',      'postres',      5),
  ('Bebidas',      'bebidas',      6);

INSERT INTO menu_items (name, description, price, category_id, available, featured, display_order) VALUES
  -- Pollos (category_id = 1)
  ('Pollo Entero a la Brasa',
   'Pollo de corral marinado 24h en nuestras especias secretas y asado lentamente en brasa de carbón. Incluye salsa alioli.',
   18.90, 1, true, true, 1),

  ('Medio Pollo con Patatas',
   'Medio pollo jugoso acompañado de patatas fritas caseras crujientes y salsa alioli de la casa.',
   11.50, 1, true, true, 2),

  ('Cuarto de Pollo',
   'Cuarto trasero o delantero a elegir. Acompañado de una guarnición a elegir.',
   6.90, 1, true, false, 3),

  ('Pollo al Limón',
   'Pollo asado con marinada de limón fresco, romero y ajo. Una versión más suave y aromática.',
   13.90, 1, true, false, 4),

  -- Entrantes (category_id = 2)
  ('Alitas Especiadas',
   'Alitas de pollo con mezcla de especias de la casa, servidas con salsa barbacoa artesanal.',
   9.90, 2, true, true, 1),

  ('Croquetas de Pollo',
   'Croquetas cremosas de bechamel con pollo asado desmechado. 8 unidades.',
   7.50, 2, true, false, 2),

  ('Pan de Ajo con Queso',
   'Pan artesano tostado con mantequilla de ajo y queso gratinado.',
   5.90, 2, true, false, 3),

  -- Ensaladas (category_id = 3)
  ('Ensalada del Palacio',
   'Pollo asado desmechado sobre cama de lechuga, tomate cherry, aguacate y vinagreta de limón.',
   10.50, 3, true, true, 1),

  ('Ensalada César',
   'Lechuga romana, pollo a la plancha, crutones caseros, parmesano y nuestra salsa César.',
   9.90, 3, true, false, 2),

  -- Guarniciones (category_id = 4)
  ('Patatas Fritas Caseras',
   'Cortadas a mano y fritas en aceite de oliva. Con sal gruesa.',
   3.50, 4, true, false, 1),

  ('Arroz con Verduras',
   'Arroz salteado con verduras de temporada al wok.',
   4.50, 4, true, false, 2),

  ('Pimientos Asados',
   'Pimientos rojos asados en horno de brasa con aceite de oliva virgen.',
   4.90, 4, true, false, 3),

  -- Postres (category_id = 5)
  ('Tarta de Queso Artesana',
   'Nuestra tarta de queso horneada al estilo vasco, con mermelada de frutos rojos.',
   5.90, 5, true, false, 1),

  ('Flan Casero',
   'Flan de huevo tradicional con caramelo artesano. La receta de la abuela.',
   4.50, 5, true, false, 2),

  -- Bebidas (category_id = 6)
  ('Agua Mineral',     'Botella 50cl - con o sin gas', 1.50, 6, true, false, 1),
  ('Refrescos',        'Coca-Cola, Fanta, Sprite, Nestea. 33cl.', 2.50, 6, true, false, 2),
  ('Cerveza Nacional', 'Estrella Damm o Mahou 33cl.', 2.90, 6, true, false, 3),
  ('Vino de la Casa',  'Tinto, blanco o rosado. Copa o media botella.', 2.50, 6, true, false, 4);


-- ============================================================
-- RENDIMIENTO — Índices
-- ============================================================
-- Acelera las consultas más frecuentes (disponibilidad por fecha/hora)

CREATE INDEX IF NOT EXISTS idx_reservations_date_time
  ON reservations(date, time)
  WHERE status <> 'cancelled';

CREATE INDEX IF NOT EXISTS idx_reservations_status
  ON reservations(status);

CREATE INDEX IF NOT EXISTS idx_encargos_date_time
  ON encargos(date, time)
  WHERE status <> 'cancelled';

CREATE INDEX IF NOT EXISTS idx_encargos_status
  ON encargos(status);

CREATE INDEX IF NOT EXISTS idx_menu_items_category
  ON menu_items(category_id)
  WHERE available = true;


-- ============================================================
-- CAPACIDAD — Trigger anti race-condition
-- ============================================================
-- Evita que dos reservas simultáneas superen las 20 mesas por slot.
-- Si el slot está lleno, PostgreSQL lanza error P0001 con mensaje "SLOT_FULL".
-- La API route lo captura y devuelve 409 al cliente.

CREATE OR REPLACE FUNCTION check_reservation_capacity()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM   reservations
    WHERE  date   = NEW.date
    AND    time   = NEW.time
    AND    status <> 'cancelled'
  ) >= 20 THEN
    RAISE EXCEPTION 'SLOT_FULL'
      USING ERRCODE = 'P0001',
            DETAIL  = 'El slot ' || NEW.date || ' ' || NEW.time || ' está completo';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar el trigger si ya existía (para re-ejecutar este script sin error)
DROP TRIGGER IF EXISTS trg_reservation_capacity ON reservations;

CREATE TRIGGER trg_reservation_capacity
  BEFORE INSERT ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION check_reservation_capacity();


-- ============================================================
-- CONSTRAINT: guests entre 1 y 12
-- ============================================================
-- La UI limita a 9+, pero validamos en BD por si acaso llega una petición
-- directa a la API. 12 = mesa grande realista para un asador.

ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_guests_check;
ALTER TABLE reservations ADD CONSTRAINT reservations_guests_check
  CHECK (guests BETWEEN 1 AND 12);


-- ============================================================
-- ¡Listo! Tu base de datos está configurada.
-- Ahora vuelve a la guía para conectarla con la web.
-- ============================================================
