import { MetadataRoute } from "next"

// Rutas reales del sitio público (excluye /admin/* y /api/*)
// Las reservas están integradas en la home (#reservar), no tienen ruta propia
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://palaciodpollo.es"

  return [
    {
      url: baseUrl,
      lastModified:     new Date(),
      changeFrequency:  "weekly",
      priority:         1,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified:     new Date(),
      changeFrequency:  "weekly",
      priority:         0.9,
    },
    {
      url: `${baseUrl}/encargar`,
      lastModified:     new Date(),
      changeFrequency:  "weekly",
      priority:         0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         0.6,
    },
  ]
}
