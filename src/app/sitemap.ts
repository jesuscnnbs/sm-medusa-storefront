import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
  console.log("🌐 Generating sitemap with base URL:", baseUrl);
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'es': `${baseUrl}/es/`,
          'en': `${baseUrl}/en/`,
        }
      }
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'es': `${baseUrl}/es/about`,
          'en': `${baseUrl}/en/about`,
        }
      }
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'es': `${baseUrl}/es/menu`,
          'en': `${baseUrl}/en/menu`,
        }
      }
    },
    {
      url: `${baseUrl}/reserve`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'es': `${baseUrl}/es/reserve`,
          'en': `${baseUrl}/en/reserve`,
        }
      }
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'es': `${baseUrl}/es/privacy-policy`,
          'en': `${baseUrl}/en/privacy-policy`,
        }
      }
    },
    {
      url: `${baseUrl}/cookies-policy`,
      lastModified: new Date(),
      alternates: {
        languages: {
          'es': `${baseUrl}/es/cookies-policy`,
          'en': `${baseUrl}/en/cookies-policy`,
        }
      }
    }
  ]
}