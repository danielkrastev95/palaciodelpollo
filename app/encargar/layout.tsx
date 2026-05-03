import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Encargos para llevar",
  description:
    "Haz tu pedido online y recógelo en el local. Pollos asados, costillar BBQ y platos caseros. Recogida de 12:00 a 16:00 todos los días. Valdemoro, Madrid.",
  openGraph: {
    title: "Encargos para llevar — El Palacio del Pollo",
    description: "Elige tus platos, indica el día y hora de recogida y ven a por ellos. Valdemoro, Madrid.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Encargos para llevar — El Palacio del Pollo",
    description: "Elige tus platos, indica el día y hora de recogida y ven a por ellos.",
  },
  alternates: {
    canonical: "/encargar",
  },
}

export default function EncargarLayout({ children }: { children: React.ReactNode }) {
  return children
}
