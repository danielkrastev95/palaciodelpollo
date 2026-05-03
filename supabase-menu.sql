-- ═══════════════════════════════════════════════════════════════
--  El Palacio del Pollo — Carta real
--  Ejecutar en: Supabase Dashboard → SQL Editor → New query
--  IMPORTANTE: esto borra los datos de prueba y carga la carta real
-- ═══════════════════════════════════════════════════════════════

-- 1. Limpiar datos de prueba (menu_items primero por FK)
DELETE FROM menu_items;
DELETE FROM categories;


-- 2. Categorías reales (8)
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Ensaladas',    'ensaladas',    NULL, 1),
  ('Pastas',       'pastas',       'Salsa a elegir: Boloñesa · Pomodoro · Del chef (tomate, carne y Roquefort) · Roquefort y nueces', 2),
  ('Raciones',     'raciones',     NULL, 3),
  ('Pollo',        'pollo',        'Guarnición a elegir: patatas fritas · arroz blanco · ensalada', 4),
  ('Carnes',       'carnes',       'Incluye: patatas fritas, arroz blanco o ensalada', 5),
  ('Pescados',     'pescados',     'Incluye: patatas fritas, arroz blanco o ensalada', 6),
  ('Postres',      'postres',      NULL, 7),
  ('Guarniciones', 'guarniciones', NULL, 8);


-- 3. Platos — referencias por slug (no dependen del ID generado)

-- ── ENSALADAS (9) ──────────────────────────────────────────────
INSERT INTO menu_items (name, description, price, category_id, available, featured, display_order) VALUES
  ('Ensalada clásica',                                    'Lechuga, tomate, cebolla y aceitunas',                         8.90,  (SELECT id FROM categories WHERE slug='ensaladas'), true, false, 1),
  ('Ensaladita rusa',                                     'Patata cocida, zanahoria, guisantes, atún y mayonesa',          8.90,  (SELECT id FROM categories WHERE slug='ensaladas'), true, false, 2),
  ('Ensalada mixta',                                      'Lechuga, tomate, atún, zanahoria, maíz, remolacha y pepino',   11.90,  (SELECT id FROM categories WHERE slug='ensaladas'), true, false, 3),
  ('Ensalada italiana',                                   'Lechuga, zanahoria, maíz, pasta, jamón dulce y queso',         10.90,  (SELECT id FROM categories WHERE slug='ensaladas'), true, false, 4),
  ('Ensalada de endibias con salmón y Roquefort',         'Endibias, zanahoria, maíz, ensalada y Roquefort',              11.90,  (SELECT id FROM categories WHERE slug='ensaladas'), true, false, 5),
  ('Ensalada César',                                      'Lechuga, pollo crujiente, picatostes y salsa César',           12.90,  (SELECT id FROM categories WHERE slug='ensaladas'), true, true,  6),
  ('Ensalada de salmón ahumado con gulas',                'Lechuga, zanahoria, salmón y gulas',                           12.90,  (SELECT id FROM categories WHERE slug='ensaladas'), true, false, 7),
  ('Ensalada de quesos con salsa Roquefort',              'Lechuga, zanahoria, maíz, quesos frescos y curados',           12.90,  (SELECT id FROM categories WHERE slug='ensaladas'), true, false, 8),
  ('Ensalada de queso de cabra con cebolla caramelizada', 'Lechuga, queso de cabra, tomate, cebolla y aceitunas',         12.90,  (SELECT id FROM categories WHERE slug='ensaladas'), true, false, 9);

-- ── PASTAS (5) ─────────────────────────────────────────────────
INSERT INTO menu_items (name, description, price, category_id, available, featured, display_order) VALUES
  ('Espaguetis de trigo',          NULL, 10.90, (SELECT id FROM categories WHERE slug='pastas'), true, false, 1),
  ('Fusilli tricolor',             NULL, 10.90, (SELECT id FROM categories WHERE slug='pastas'), true, false, 2),
  ('Cuadrottis rellenos de queso', NULL, 10.90, (SELECT id FROM categories WHERE slug='pastas'), true, false, 3),
  ('Raviolis rellenos de carne',   NULL, 10.90, (SELECT id FROM categories WHERE slug='pastas'), true, false, 4),
  ('Tagliatelles negros frescos',  NULL, 10.90, (SELECT id FROM categories WHERE slug='pastas'), true, false, 5);

-- ── RACIONES (29 · Raciones I + II fusionadas) ─────────────────
INSERT INTO menu_items (name, description, price, category_id, available, featured, display_order) VALUES
  ('Croquetas caseras de jamón',                              NULL,                                                                     9.80,  (SELECT id FROM categories WHERE slug='raciones'), true, true,  1),
  ('Empanadillas de atún',                                    NULL,                                                                     9.80,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 2),
  ('Buñuelos de bacalao con salsa alioli',                    NULL,                                                                     9.80,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 3),
  ('Calabacín a la gabardina con alioli',                     NULL,                                                                     9.80,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 4),
  ('Pimientos verdes fritos',                                 NULL,                                                                     8.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 5),
  ('Pisto manchego',                                          NULL,                                                                     9.80,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 6),
  ('Mollejas de pollo al Jerez',                              NULL,                                                                    11.80,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 7),
  ('Setas a la parrilla con jamón y salsa alioli',            NULL,                                                                    11.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 8),
  ('Huevos estrellados con jamón, chistorra y chorizo',       NULL,                                                                    11.90,  (SELECT id FROM categories WHERE slug='raciones'), true, true,  9),
  ('Espárragos verdes a la plancha con salsa alioli',         NULL,                                                                    10.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 10),
  ('Lacón asado con pimientos rojos',                         NULL,                                                                    12.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 11),
  ('Pimiento de piquillo relleno de ternera',                 NULL,                                                                    12.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 12),
  ('Calamares a la romana',                                   NULL,                                                                    14.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 13),
  ('Langostinos a la gabardina con salsa rosa',               NULL,                                                                    14.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 14),
  ('Alitas Tex-Mex con salsa barbacoa',                       NULL,                                                                    10.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 15),
  ('Sticks de mozzarella con salsa barbacoa',                 NULL,                                                                    12.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 16),
  ('Combo americano con salsa barbacoa',                      'Stick de mozzarella, aros de cebolla, jalapeños y patatas americanas',  14.80,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 17),
  ('Rollito de primavera',                                    NULL,                                                                     3.40,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 18),
  ('Jalapeños rellenos de queso cheddar con salsa barbacoa',  NULL,                                                                    12.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 19),
  ('Quesadilla de jamón, 4 quesos y salsa de yogur',          NULL,                                                                    11.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 20),
  ('Berenjena rellena de carne y bechamel',                   NULL,                                                                    10.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 21),
  ('Dúo de calabacín y berenjena a la plancha con nuez y queso', NULL,                                                                10.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 22),
  ('Crepe de pollo, cebolla caramelizada y ensalada',         NULL,                                                                    10.40,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 23),
  ('Tigres de mejillones gallegos',                           NULL,                                                                    14.90,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 24),
  ('Paella mixta',                                            NULL,                                                                     9.40,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 25),
  ('Gazpacho',                                                NULL,                                                                     7.40,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 26),
  ('Consomé con jamón',                                       NULL,                                                                     7.40,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 27),
  ('Lentejas',                                                NULL,                                                                     7.40,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 28),
  ('Fabada asturiana',                                        NULL,                                                                     7.40,  (SELECT id FROM categories WHERE slug='raciones'), true, false, 29);

-- ── POLLO (6) ──────────────────────────────────────────────────
INSERT INTO menu_items (name, description, price, category_id, available, featured, display_order) VALUES
  ('Pollo asado entero',          'A elegir: hierbas o limón',              17.80, (SELECT id FROM categories WHERE slug='pollo'), true, true,  1),
  ('Medio pollo asado',           'A elegir: hierbas o limón',               9.50, (SELECT id FROM categories WHERE slug='pollo'), true, true,  2),
  ('Cuarto de pollo con guarnición', NULL,                                    8.90, (SELECT id FROM categories WHERE slug='pollo'), true, false, 3),
  ('Medio pollo con guarnición',  NULL,                                      12.50, (SELECT id FROM categories WHERE slug='pollo'), true, false, 4),
  ('Menú medio pollo',            'Guarnición, pan y bebida incluidos',       9.90, (SELECT id FROM categories WHERE slug='pollo'), true, false, 5),
  ('Menú cuarto de pollo',        'Guarnición, pan y bebida incluidos',       8.90, (SELECT id FROM categories WHERE slug='pollo'), true, false, 6);

-- ── CARNES (10) ────────────────────────────────────────────────
INSERT INTO menu_items (name, description, price, category_id, available, featured, display_order) VALUES
  ('Costillar americano con barbacoa',    NULL,                                                    17.90, (SELECT id FROM categories WHERE slug='carnes'), true, true,  1),
  ('Entrecot a la parrilla',              'Salsa a elegir: Roquefort, pimienta o barbacoa',        18.90, (SELECT id FROM categories WHERE slug='carnes'), true, true,  2),
  ('Cachopo con jamón serrano y queso',   NULL,                                                    18.90, (SELECT id FROM categories WHERE slug='carnes'), true, false, 3),
  ('Codillo asado',                       NULL,                                                    14.90, (SELECT id FROM categories WHERE slug='carnes'), true, false, 4),
  ('Bistec a la parrilla',                NULL,                                                    14.90, (SELECT id FROM categories WHERE slug='carnes'), true, false, 5),
  ('Escalope de ternera',                 NULL,                                                    14.90, (SELECT id FROM categories WHERE slug='carnes'), true, false, 6),
  ('Bocaditos de pollo con salsa barbacoa', NULL,                                                  12.90, (SELECT id FROM categories WHERE slug='carnes'), true, false, 7),
  ('Escalope de pollo',                   NULL,                                                    12.90, (SELECT id FROM categories WHERE slug='carnes'), true, false, 8),
  ('Escalopines de lomo',                 NULL,                                                    11.90, (SELECT id FROM categories WHERE slug='carnes'), true, false, 9),
  ('San Jacobo',                          NULL,                                                    10.90, (SELECT id FROM categories WHERE slug='carnes'), true, false, 10);

-- ── PESCADOS (4) ───────────────────────────────────────────────
INSERT INTO menu_items (name, description, price, category_id, available, featured, display_order) VALUES
  ('Lubina a la plancha',           NULL, 15.90, (SELECT id FROM categories WHERE slug='pescados'), true, false, 1),
  ('Emperador a la plancha',        NULL, 15.90, (SELECT id FROM categories WHERE slug='pescados'), true, false, 2),
  ('Merluza a la romana o en salsa', NULL, 15.90, (SELECT id FROM categories WHERE slug='pescados'), true, false, 3),
  ('Mejillones gallegos al vapor',  NULL, 14.90, (SELECT id FROM categories WHERE slug='pescados'), true, false, 4);

-- ── POSTRES (7) ────────────────────────────────────────────────
INSERT INTO menu_items (name, description, price, category_id, available, featured, display_order) VALUES
  ('Ración de tarta',               NULL,            5.20, (SELECT id FROM categories WHERE slug='postres'), true, false, 1),
  ('Tarta de queso',                'Sin hornear',   5.20, (SELECT id FROM categories WHERE slug='postres'), true, true,  2),
  ('Tarta helada',                  NULL,            5.20, (SELECT id FROM categories WHERE slug='postres'), true, false, 3),
  ('Brownie con helado',            NULL,            5.20, (SELECT id FROM categories WHERE slug='postres'), true, false, 4),
  ('Profiteroles con chocolate',    NULL,            5.20, (SELECT id FROM categories WHERE slug='postres'), true, false, 5),
  ('Crepes con sirope de chocolate', NULL,           5.20, (SELECT id FROM categories WHERE slug='postres'), true, false, 6),
  ('Torrijas',                      NULL,            5.20, (SELECT id FROM categories WHERE slug='postres'), true, false, 7);

-- ── GUARNICIONES (10: patatas + salsas) ───────────────────────
INSERT INTO menu_items (name, description, price, category_id, available, featured, display_order) VALUES
  ('Patatas fritas grandes',   NULL,                  8.90, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 1),
  ('Patatas fritas medianas',  NULL,                  7.90, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 2),
  ('Patatas americanas',       'Con salsa barbacoa',  9.40, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 3),
  ('Patatas Paris',            'Con salsa barbacoa',  9.40, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 4),
  ('Salsa rosa',               NULL,                  1.80, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 5),
  ('Alioli',                   NULL,                  1.80, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 6),
  ('Salsa barbacoa',           NULL,                  1.80, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 7),
  ('Salsa Roquefort',          NULL,                  1.80, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 8),
  ('Salsa brava',              NULL,                  1.80, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 9),
  ('Salsa de yogur',           NULL,                  1.80, (SELECT id FROM categories WHERE slug='guarniciones'), true, false, 10);


-- ── Verificación ──────────────────────────────────────────────
SELECT c.name AS categoria, COUNT(i.id) AS platos
FROM categories c
LEFT JOIN menu_items i ON i.category_id = c.id
GROUP BY c.name, c.display_order
ORDER BY c.display_order;
-- Resultado esperado: 8 filas, total 80 platos
