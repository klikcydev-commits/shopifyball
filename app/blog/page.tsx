import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

import { getPageMetadata } from '@/lib/seo/build-metadata'

export const metadata: Metadata = getPageMetadata('/blog')

interface BlogPost {
  slug: string
  title: string
  date: string
  meta_description: string
  focus_keyword: string
  theme: string
}

interface IndexPost {
  slug: string
  title: string
  city: string
  focusKeyword: string
  date: string
  description?: string
}

function getAllPosts(): BlogPost[] {
  try {
    const blogDir = join(process.cwd(), 'content/blog')
    const postsDir = join(blogDir, 'posts')
    const bySlug = new Map<string, BlogPost>()

    function addFromFile(dir: string, file: string, defaultTheme: string) {
      if (!file.endsWith('.mdx') && !file.endsWith('.md')) return
      const slugFromFile = file.replace(/\.(mdx|md)$/, '')
      try {
        const filePath = join(dir, file)
        const fileContents = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(fileContents)
        const slug = data.slug || slugFromFile
        bySlug.set(slug, {
          slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString(),
          meta_description: data.meta_description || '',
          focus_keyword: data.focus_keyword || '',
          theme: data.theme || data.city || defaultTheme,
        })
      } catch (error) {
        console.error(`Error reading blog post ${file}:`, error)
      }
    }

    // 1. Load every .mdx/.md from content/blog (buying guides, etc.)
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir)
      for (const file of files) {
        if (file === 'index.json') continue
        addFromFile(blogDir, file, 'Accessories')
      }
    }

    // 2. Load every .mdx/.md from content/blog/posts (city variants)
    if (fs.existsSync(postsDir)) {
      const postFiles = fs.readdirSync(postsDir)
      for (const file of postFiles) {
        addFromFile(postsDir, file, 'UAE Gifts')
      }
    }

    // 3. Overlay index.json so indexed posts get title/description/city from index
    const indexPath = join(blogDir, 'index.json')
    if (fs.existsSync(indexPath)) {
      const indexRaw = fs.readFileSync(indexPath, 'utf8')
      const indexPosts: IndexPost[] = JSON.parse(indexRaw)
      for (const p of indexPosts) {
        const existing = bySlug.get(p.slug)
        bySlug.set(p.slug, {
          slug: p.slug,
          title: p.title,
          date: p.date || existing?.date || new Date().toISOString(),
          meta_description: p.description ?? existing?.meta_description ?? '',
          focus_keyword: p.focusKeyword ?? existing?.focus_keyword ?? '',
          theme: p.city || 'UAE Gifts',
        })
      }
    }

    const result = Array.from(bySlug.values())
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return result
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export default function BlogPage() {
  const posts = getAllPosts()

  const groupedByTheme = posts.reduce((acc, post) => {
    const theme = post.theme || 'Accessories'
    if (!acc[theme]) {
      acc[theme] = []
    }
    acc[theme].push(post)
    return acc
  }, {} as Record<string, BlogPost[]>)

  // Show "Accessories" (buying guides) first, then other themes alphabetically
  const themeOrder = Object.keys(groupedByTheme).sort((a, b) => {
    if (a === 'Accessories') return -1
    if (b === 'Accessories') return 1
    return a.localeCompare(b)
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Football Accessories Blog
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Expert guides on football accessories, Real Madrid kits, and goalkeeper gear in Dubai & UAE. 
                Buying guides, sizing tips, and authenticity checks.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {themeOrder.map((theme) => {
                const themePosts = groupedByTheme[theme]
                if (!themePosts?.length) return null
                return (
              <div key={theme} className="mb-16">
                <h2 className="text-3xl font-bold mb-8 capitalize">{theme}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {themePosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group block bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                            {theme}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {post.meta_description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {post.date && new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
                )
              })}

            {posts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">
                  No blog posts found
                </p>
                <p className="text-muted-foreground">
                  Blog posts will appear here once they are created.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
