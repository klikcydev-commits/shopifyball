import { MetadataRoute } from 'next'
import { getCollections, getProducts } from '@/lib/shopify'

// Force dynamic rendering for sitemap
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lemah.com'

  const routes = [
    '',
    '/search',
    '/about',
    '/blog',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Add collection pages
    const collections = await getCollections(50)
    const collectionRoutes = collections.map((collection) => ({
      url: `${baseUrl}/search?collection=${collection.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Add product pages (limit to first 1000 for performance)
    const { products } = await getProducts({ first: 1000 })
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    return [...routes, ...collectionRoutes, ...productRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return routes
  }
}


