import { MetadataRoute } from 'next'
import { getSitemapBaseUrl } from '@/lib/seo/build-metadata'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSitemapBaseUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}



