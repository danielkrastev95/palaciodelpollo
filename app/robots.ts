import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://palaciodpollo.es"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",        // Panel de administración
          "/admin/",
          "/api/",         // Todas las API routes (incluyendo /api/admin/*)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
