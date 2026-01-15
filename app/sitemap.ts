import { MetadataRoute } from 'next'
import { getCollections, getProducts } from '@/lib/shopify'
import { readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

// Force dynamic rendering for sitemap
export const dynamic = 'force-dynamic'

function getAllBlogPosts() {
  try {
    const postsDirectory = join(process.cwd(), 'content/blog')
    const fs = require('fs')
    if (!fs.existsSync(postsDirectory)) {
      return []
    }
    const files = fs.readdirSync(postsDirectory)
    
    return files
      .filter((file: string) => file.endsWith('.mdx') || file.endsWith('.md'))
      .map((file: string) => {
        const filePath = join(postsDirectory, file)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data } = matter(fileContents)
        return {
          slug: data.slug || file.replace(/\.(mdx|md)$/, ''),
          date: data.date || new Date().toISOString(),
        }
      })
  } catch (error) {
    console.error('Error reading blog posts for sitemap:', error)
    return []
  }
}

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
    // Add blog posts
    const blogPosts = getAllBlogPosts()
    const blogRoutes = blogPosts.map((post: { slug: string; date: string }) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

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

    return [...routes, ...blogRoutes, ...collectionRoutes, ...productRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return routes
  }
}


