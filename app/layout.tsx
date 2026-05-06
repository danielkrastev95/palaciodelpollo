import type { Metadata, Viewport } from "next"
import { Bodoni_Moda, Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import ThemeProvider from "@/components/layout/ThemeProvider"
import ThemeToggle from "@/components/layout/ThemeToggle"
import CookieConsent from "@/components/ui/CookieConsent"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://palaciodpollo.es"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "El Palacio del Pollo",
  description: "Pollos asados, costillar a la BBQ y platos caseros de los de toda la vida. Para llevar, para quedarse, para domingo en familia.",
  url: SITE_URL,
  telephone: "+34918953216",
  priceRange: "€€",
  servesCuisine: ["Spanish", "Grilled Chicken", "BBQ"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Pozo Chico 30",
    addressLocality: "Valdemoro",
    addressRegion: "Madrid",
    postalCode: "28340",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.1897,
    longitude: -3.6703,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "12:00",
      closes: "16:00",
    },
  ],
  image: `${SITE_URL}/opengraph-image`,
  hasMenu: `${SITE_URL}/menu`,
}

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],        // quitamos 500 y 600 — casi idénticos al 400/700
  variable: "--font-bodoni",
  display: "swap",
})

const instrument = Instrument_Serif({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
  variable: "--font-instrument",
  display: "swap",
})

const inter = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "600"],        // quitamos 500 y 700 — usamos 600 como bold
  variable: "--font-inter",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],               // quitamos 500 — la diferencia es imperceptible en mono
  variable: "--font-jetbrains",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // viewport-fit: cover → la web ocupa toda la pantalla en iPhones con notch.
  // Compensamos el safe-area-inset-top en la navbar para que su fondo
  // cubra la zona del status bar y no se vea contenido translúcido detrás.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EDE1" },
    { media: "(prefers-color-scheme: dark)",  color: "#1A1410" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "El Palacio del Pollo | Asador · Valdemoro",
    template: "%s | El Palacio del Pollo",
  },
  description:
    "Pollos asados, costillar a la BBQ y platos caseros de los de toda la vida. Para llevar, para quedarse, para domingo en familia. Valdemoro, Madrid.",
  keywords: ["asador", "pollo asado", "costillar", "Valdemoro", "Madrid", "para llevar", "restaurante familiar"],
  openGraph: {
    title: "El Palacio del Pollo — Asador en Valdemoro",
    description: "Pollos asados, costillar BBQ y platos caseros. Para llevar o para quedarse. Valdemoro, Madrid.",
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "El Palacio del Pollo",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "El Palacio del Pollo — Asador en Valdemoro, Madrid" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Palacio del Pollo — Asador en Valdemoro",
    description: "Pollos asados, costillar BBQ y platos caseros. Para llevar o para quedarse.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${bodoni.variable} ${instrument.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body suppressHydrationWarning>
        {/* Anti-flash: aplica dark antes de que React hidrate */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(location.pathname.startsWith('/admin'))return;if(localStorage.getItem('theme')==='dark')document.body.classList.add('dark');}catch(e){}})()` }} />
        {/* JSON-LD: datos estructurados para Google (rich snippets de restaurante) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <a href="#main-content" className="skip-link">Ir al contenido</a>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <ThemeToggle />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
