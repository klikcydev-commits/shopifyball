import { MetadataRoute } from 'next'

/** Canonical sitemap URL. Always lemah.store so GSC and AI crawlers discover all pages. */
const SITEMAP_URL = 'https://lemah.store/sitemap.xml'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Allow common AI/LLM crawlers to index for search and answers (optional: remove or add disallow to block).
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Claude-Web', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Anthropic-AI', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Google-Extended', allow: '/', disallow: ['/api/', '/admin/'] },
    ],
    sitemap: SITEMAP_URL,
  }
}



