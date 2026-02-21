import { MetadataRoute } from 'next'

/** Canonical sitemap URL. Always lemah.store so GSC discovers pages regardless of deployment host. */
const SITEMAP_URL = 'https://lemah.store/sitemap.xml'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: SITEMAP_URL,
  }
}



