import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con El Palacio del Pollo. Calle Pozo Chico 30, Valdemoro, Madrid. Teléfono: +34 918 95 32 16. Abierto de 12:00 a 16:00 todos los días.",
  openGraph: {
    title: "Contacto — El Palacio del Pollo",
    description: "Calle Pozo Chico 30, Valdemoro, Madrid · +34 918 95 32 16 · 12:00–16:00",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto — El Palacio del Pollo",
    description: "Calle Pozo Chico 30, Valdemoro · +34 918 95 32 16",
  },
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
