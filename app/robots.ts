import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lemah.store'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    // Sitemap index; /11kit is noindex,follow and excluded from sitemap-pages until launch
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}



