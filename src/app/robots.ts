import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*/admin/',      // Block admin pages in all locales (/es/admin, /en/admin)
          '/api/admin/',    // Block admin API routes
          '/*/account/',    // Block user account pages
          '/*/checkout/',   // Block checkout flow
          '/*/cart/',       // Block cart pages
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}