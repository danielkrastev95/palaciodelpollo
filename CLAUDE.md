# CLAUDE.md - Palacio del Pollo

> Guia de referencia para desarrollo con Claude Code. Actualizar cuando cambien patrones o arquitectura.

## Stack Tecnologico

- **Framework:** Next.js 15.5 (App Router, Turbopack en dev)
- **React:** 19.1.0
- **TypeScript:** 5 (strict mode)
- **Base de datos:** Supabase PostgreSQL
- **Estilos:** Tailwind CSS 4 + CSS custom (globals.css)
- **Email:** Resend API
- **Testing:** Playwright (e2e)
- **Errores:** Sentry (opcional)
- **Formularios:** react-hook-form + zod
- **Animaciones:** framer-motion
- **Iconos:** lucide-react

## Comandos Principales

```bash
npm run dev        # Desarrollo con Turbopack
npm run build      # Build de produccion
npm run start      # Servidor produccion
npm run lint       # ESLint
npm run typecheck  # Verificacion TypeScript
npm run e2e        # Tests Playwright
npm run e2e:ui     # Tests con UI
```

## Estructura del Proyecto

```
app/
├── layout.tsx              # Root layout, fonts, metadata, JSON-LD
├── page.tsx                # Home (HeroSection, Ritual, Menu, Reservas, Voices, Gallery)
├── globals.css             # CSS global + variables + dark mode (~1600 lineas)
├── error.tsx               # Error boundary global
├── not-found.tsx           # Pagina 404
├── opengraph-image.tsx     # OG image dinamico
├── robots.ts               # robots.txt
├── sitemap.ts              # sitemap.xml
│
├── about/                  # Sobre nosotros
├── contact/                # Formulario contacto
├── menu/                   # Menu completo (MenuPageClient.tsx)
├── reservations/           # Pagina reservas standalone
├── encargar/               # Pedidos para llevar con carrito
├── cookies/                # Politica de cookies
├── legal/                  # Terminos legales
│
├── admin/                  # Panel admin (protegido por middleware)
│   ├── page.tsx            # Login
│   ├── dashboard/          # Dashboard con stats
│   ├── menu/               # Gestion menu
│   ├── orders/             # Gestion encargos
│   ├── reservations/       # Gestion reservas
│   ├── messages/           # Mensajes contacto
│   └── _shared/            # Componentes admin compartidos
│
└── api/
    ├── reservations/       # POST crear reserva
    ├── encargos/           # POST crear encargo
    ├── availability/       # GET slots disponibles
    ├── email/              # POST envio email
    └── admin/              # Endpoints protegidos (login, logout, CRUD)

components/
├── layout/                 # Navbar, Footer, ThemeProvider, ThemeToggle
├── sections/               # HeroSection, Ritual, MenuEditorial, ReservationSection, Voices, Gallery
└── ui/                     # CalendarWidget, FieldError, CookieConsent

lib/
├── supabase.ts             # Cliente Supabase (publico + server)
├── auth.ts                 # isAdmin(), requireAdmin() - HMAC auth
├── validators.ts           # nameErr(), phoneErr(), emailErr()
├── email.ts                # Templates HTML + sendEmail()
├── calendar.ts             # Utilidades calendario
├── rate-limit.ts           # Rate limiting en memoria
├── env.ts                  # Validacion variables entorno
└── content.ts              # Datos fallback (RITUAL_STEPS, VOICES, MENU_DATA)

types/
└── database.ts             # Tipos Supabase generados

middleware.ts               # Auth admin, rate limit, security headers
```

## Variables de Entorno Requeridas

```bash
# Supabase (publicas - prefijo NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Supabase (servidor - sin prefijo)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Admin
ADMIN_PASSWORD=contrasena_humana_min_12_chars     # La que se teclea en /admin
ADMIN_SECRET_KEY=64_chars_hex_aleatorios          # Firma cookies, nunca se teclea

# Email (opcional - emails son fire-and-forget)
RESEND_API_KEY=re_...
RESEND_FROM=noreply@tudominio.com
RESTAURANT_EMAIL=info@palaciopollo.es

# Sentry (opcional)
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=sntrys_...
SENTRY_ORG=tu-org
SENTRY_PROJECT=palacio-del-pollo

# Site
NEXT_PUBLIC_SITE_URL=https://palaciodpollo.es
```

## Base de Datos (Supabase)

### Tablas Principales

| Tabla | Descripcion | Indices |
|-------|-------------|---------|
| `categories` | Categorias del menu (Pollos, Entrantes, etc.) | slug UNIQUE |
| `menu_items` | Platos con precio, imagen, disponibilidad | category_id FK |
| `reservations` | Reservas de mesa | (date, time), status |
| `encargos` | Pedidos para llevar | (date, time), status |
| `contact_messages` | Mensajes del formulario contacto | - |

### Constraints Importantes

- `reservations.guests`: BETWEEN 1 AND 12
- Trigger `check_reservation_capacity`: maximo 20 mesas por slot horario
- RLS habilitado: anon puede SELECT menu/categorias, INSERT en formularios

### Archivos SQL de Referencia

- `supabase-setup.sql` - Estructura de tablas, triggers, RLS
- `supabase-menu.sql` - Datos iniciales del menu (~80 platos)

## Autenticacion Admin

**Tipo:** Cookie firmada con HMAC-SHA256

```typescript
// Verificar si es admin en API route:
import { isAdmin, requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
  if (!await isAdmin(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  // ... logica admin
}
```

**Caracteristicas:**
- Cookie HTTPOnly + Secure + SameSite=strict
- TTL: 8 horas
- timingSafeEqual para evitar timing attacks
- Rate limit: 5 intentos/minuto por IP

## Patrones de Codigo

### Validacion con Zod (API routes)

```typescript
import { z } from "zod"

const schema = z.object({
  name:   z.string().min(2).max(100),
  email:  z.string().email(),
  phone:  z.string().min(9),
  guests: z.number().int().min(1).max(12),
})

const result = schema.safeParse(body)
if (!result.success) {
  return NextResponse.json({ error: "Datos no validos" }, { status: 400 })
}
```

### Rate Limiting (Memoria)

Rate limiting simple en memoria. Suficiente para un restaurante con tráfico normal.

```typescript
import { checkRateLimit, getIP } from "@/lib/rate-limit"

const ip = getIP(request)
const limit = await checkRateLimit("reservations", ip) // async!

if (!limit.allowed) {
  return NextResponse.json(
    { success: false, error: "Demasiadas solicitudes" },
    { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
  )
}
```

**Tipos de limiter disponibles:**
| Tipo | Limite | Ventana |
|------|--------|---------|
| `reservations` | 3 | 10 min |
| `encargos` | 3 | 10 min |
| `availability` | 30 | 1 min |
| `login` | 5 | 1 min |
```

### API Response Format (Unificado)

Todas las APIs usan el mismo formato de respuesta:

```typescript
// Exito
{ success: true }
{ success: true, data: { ... } }

// Error
{ success: false, error: "Mensaje de error" }
```

Ejemplos:
- `POST /api/reservations` → `{ success: true }`
- `GET /api/availability` → `{ success: true, data: { counts: { "12:00": 5 } } }`
- `GET /api/admin/orders` → `{ success: true, data: [...] }`
- Error 400 → `{ success: false, error: "Datos no validos" }`

### Envio de Emails (fire-and-forget)

```typescript
import { sendEmail, tplNuevaReserva } from "@/lib/email"

// No esperamos resultado - si falla, no afecta la reserva
sendEmail({
  to: RESTAURANT_EMAIL,
  subject: "Nueva reserva",
  html: tplNuevaReserva({ name, date, time, guests }),
}).catch(() => {})
```

### Supabase Server-side

```typescript
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  const supabase = createServerSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: "DB no disponible" }, { status: 503 })
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
```

## Estilos (CSS Variables)

```css
/* Paleta de colores */
--paper:      #F3EDE1  /* Fondo claro */
--paper-2:    #EBE3D3
--ink:        #1A1410  /* Texto principal */
--ink-2:      #3A2F26
--ink-3:      #6B5D50
--ember:      #C94B1F  /* Accent naranja */
--ember-dark: #8A2D0F
--gold:       #9B7A2C  /* Accent dorado */
--cream:      #FBF6EA

/* Tipografia */
--font-display: "Bodoni Moda"      /* Titulos grandes */
--font-body:    "Instrument Serif" /* Cuerpo */
--font-ui:      "Inter Tight"      /* UI, nav */
--font-mono:    "JetBrains Mono"   /* Sellos */
```

## Seguridad Implementada

| Medida | Ubicacion |
|--------|-----------|
| HMAC-SHA256 auth | middleware.ts, lib/auth.ts |
| Rate limiting | lib/rate-limit.ts |
| Zod validation | app/api/*/route.ts |
| RLS (Row Level Security) | Supabase |
| HTTPOnly cookies | API login |
| Security headers | next.config.ts |
| timingSafeEqual | lib/auth.ts |
| XSS headers | next.config.ts |

## Advertencias y Limitaciones

1. **Rate limiting** - Usa memoria local. Suficiente para tráfico normal de restaurante. Si escala mucho, considerar Upstash Redis.

2. **Emails fire-and-forget** - Si Resend falla, el email se pierde pero la reserva se crea.

3. **Admin password unica** - No hay sistema de usuarios, solo `ADMIN_SECRET_KEY` en env.

4. **Maximo 20 mesas por slot** - Validado por trigger PostgreSQL, no editable desde UI.

5. **Guests maximo 12** - Constraint en BD, cambiar requiere migracion.

## Convencion de Nombres

- **Componentes:** PascalCase (`ReservationSection.tsx`)
- **Hooks:** camelCase con prefijo use (`useTheme`)
- **Utilidades:** camelCase (`sendEmail`, `checkRateLimit`)
- **Constantes:** SCREAMING_SNAKE_CASE (`MONTH_NAMES`, `VALID_TIMES`)
- **Variables estado:** camelCase (`selectedDay`, `isLoading`)
- **Handlers:** prefijo `handle` u `on` (`handleSubmit`, `onSelect`)

## Debugging

```bash
# Ver logs de Supabase en consola
# Los errores aparecen en console.error

# Verificar variables de entorno
npm run dev  # Warnings aparecen si faltan variables

# Testing local sin Supabase
# La app funciona con funcionalidad limitada (solo datos fallback de lib/content.ts)
```

## Patrones de Estado Complejo (useReducer)

Para componentes con estado complejo, usar el patron de `ReservationSection.tsx`:

```typescript
// 1. Definir State y Action types
interface State { step: 1 | 2; name: string; /* ... */ }
type Action =
  | { type: "SET_STEP"; step: 1 | 2 }
  | { type: "SET_FIELD"; field: "name"; value: string }
  | { type: "RESET" }

// 2. Reducer puro
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP": return { ...state, step: action.step }
    // ...
  }
}

// 3. Initial state factory
function createInitialState(): State { /* ... */ }

// 4. Usar en componente
const [state, dispatch] = useReducer(reducer, null, createInitialState)
```

## Memoization

- **React.memo**: Sub-componentes que reciben props estables
- **useMemo**: Calculos derivados (errors, dayName, cells)
- **useCallback**: Handlers pasados a sub-componentes

```typescript
// Sub-componente memoizado
const TimeSlot = memo(function TimeSlot({ time, onSelect }: Props) { })

// Calculo memoizado
const errors = useMemo(() => ({
  name: nameErr(state.name),
  phone: phoneErr(state.phone),
}), [state.name, state.phone])

// Callback estable
const handleSelectTime = useCallback((time: string) => {
  dispatch({ type: "SELECT_TIME", time })
}, [])
```

## Proximos Pasos / Deuda Tecnica

- [x] ~~Rate limiting en memoria (suficiente para restaurante)~~
- [x] ~~Separar ReservationSection en sub-componentes~~
- [x] ~~Implementar useReducer para estado complejo~~
- [x] ~~Agregar memoization (React.memo, useMemo, useCallback)~~
- [x] ~~Tests E2E con Playwright~~
- [x] ~~Crear .env.example~~
- [ ] Agregar Server Actions donde aplique
- [ ] Documentar API con OpenAPI/Swagger
