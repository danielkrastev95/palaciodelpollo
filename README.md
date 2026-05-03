# El Palacio del Pollo

Web del restaurante asador El Palacio del Pollo. Incluye home editorial, menú, sistema de reservas, encargos para llevar, formulario de contacto y panel de administración.

## Stack

- Next.js 15.5 (App Router, Turbopack en desarrollo)
- React 19.1, TypeScript 5 (strict)
- Tailwind CSS 4 + CSS variables en `app/globals.css`
- Supabase (PostgreSQL) para datos y RLS
- Resend para envío de emails (opcional)
- Sentry para monitoreo de errores (opcional)
- Playwright para tests end-to-end
- react-hook-form + Zod para formularios

## Requisitos previos

- Node.js 18.18 o superior
- Cuenta en Supabase (https://supabase.com)
- Cuenta en Resend para emails (https://resend.com) — opcional
- Cuenta en Sentry (https://sentry.io) — opcional

## Instalación

```bash
npm install
```

Copia `.env.example` a `.env.local` y rellena los valores:

```bash
cp .env.example .env.local
```

Variables obligatorias:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` — desde Supabase Dashboard, Settings, API.
- `SUPABASE_SERVICE_ROLE_KEY` — misma sección. No exponer al cliente.
- `ADMIN_PASSWORD` — contraseña que se teclea para acceder al panel `/admin`. Mínimo 12 caracteres. Es la única que el cliente necesita recordar.
- `ADMIN_SECRET_KEY` — clave criptográfica que firma las cookies de sesión admin. Nunca se teclea. Mínimo 32 caracteres aleatorios. Generar con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

Variables opcionales:

- `RESEND_API_KEY`, `RESEND_FROM`, `RESTAURANT_EMAIL` — si no se configuran, los emails no se envían pero la app sigue funcionando.
- `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` — sin DSN, Sentry se desactiva automáticamente.
- `NEXT_PUBLIC_SITE_URL` — URL canónica del sitio para SEO y enlaces en emails.

## Base de datos

En el SQL Editor de Supabase, ejecutar en orden:

1. `supabase-setup.sql` — crea tablas (`categories`, `menu_items`, `reservations`, `encargos`, `contact_messages`), triggers y políticas RLS.
2. `supabase-menu.sql` — inserta los datos iniciales del menú.

Constraints relevantes:

- `reservations.guests` entre 1 y 12.
- Trigger `check_reservation_capacity` limita a 20 mesas por franja horaria.
- RLS habilitado: `anon` puede leer menú/categorías e insertar en formularios públicos.

## Comandos

```bash
npm run dev        # Desarrollo en http://localhost:3000
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run lint       # ESLint
npm run lint:ci    # ESLint estricto (sin warnings)
npm run typecheck  # Verificación TypeScript
npm run e2e        # Tests Playwright
npm run e2e:ui     # Tests con interfaz
```

Antes de cada despliegue, ejecutar:

```bash
npm run typecheck && npm run lint:ci && npm run build && npm run e2e
```

## Estructura

```
app/
  layout.tsx              Root layout, fonts, metadata, JSON-LD
  page.tsx                Home
  globals.css             Estilos globales y variables CSS
  about/                  Sobre nosotros
  contact/                Formulario de contacto
  menu/                   Menú completo
  reservations/           Página de reservas
  encargar/               Pedidos para llevar
  cookies/, legal/        Páginas legales
  admin/                  Panel admin (protegido)
  api/                    Endpoints (reservations, encargos, availability, email, admin/*)

components/
  layout/                 Navbar, Footer, ThemeProvider
  sections/               Secciones del home
  ui/                     Componentes reutilizables

lib/
  supabase.ts             Clientes Supabase (público y servidor)
  auth.ts                 Autenticación admin (HMAC-SHA256)
  validators.ts           Validadores de campos
  email.ts                Plantillas y envío
  rate-limit.ts           Rate limiting en memoria
  env.ts                  Validación de variables de entorno
  content.ts              Datos de fallback

middleware.ts             Protección admin, rate limit, security headers
```

## Panel de administración

Acceso en `/admin`. Autenticación mediante cookie firmada con HMAC-SHA256 (HTTPOnly, Secure, SameSite=strict, TTL 8 horas).

Secciones:

- `/admin/dashboard` — métricas generales.
- `/admin/menu` — gestión del menú.
- `/admin/reservations` — reservas recibidas.
- `/admin/orders` — encargos para llevar.
- `/admin/messages` — mensajes del formulario de contacto.

Rate limit en login: 5 intentos por minuto por IP.

## Despliegue

### Vercel (recomendado)

1. Conectar el repositorio en https://vercel.com/new.
2. Añadir todas las variables de entorno desde `.env.local` en Settings, Environment Variables.
3. Configurar el dominio de producción y actualizar `NEXT_PUBLIC_SITE_URL`.
4. Push a la rama de producción para disparar el build.

### Otro hosting

Cualquier hosting compatible con Next.js 15 (Node.js 18.18+). Asegurar:

- Variables de entorno configuradas en el panel del hosting.
- Build con `npm run build`, arranque con `npm run start`.
- HTTPS activo (cookies admin requieren `Secure`).

## Checklist previo a entrega

- [ ] Variables de entorno configuradas en producción.
- [ ] `ADMIN_PASSWORD` configurada (mín. 12 caracteres) y `ADMIN_SECRET_KEY` generada con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- [ ] SQL ejecutado en Supabase de producción (`supabase-setup.sql` y `supabase-menu.sql`).
- [ ] Dominio personalizado y `NEXT_PUBLIC_SITE_URL` actualizado.
- [ ] `npm run build` y `npm run e2e` sin errores.
- [ ] Sentry configurado (o logging alternativo).
- [ ] Prueba manual: crear reserva, recibir email, login admin, ver reserva en dashboard.

## Seguridad

Medidas implementadas:

- Headers de seguridad en `next.config.ts` (HSTS, X-Frame-Options, X-Content-Type-Options).
- Validación Zod server-side en todas las rutas de API.
- Rate limiting en memoria (`lib/rate-limit.ts`).
- Comparación con `timingSafeEqual` en autenticación admin.
- Row Level Security en Supabase.
- Cookies HTTPOnly, Secure, SameSite=strict.

## Licencia

Privado. Todos los derechos reservados a El Palacio del Pollo.
