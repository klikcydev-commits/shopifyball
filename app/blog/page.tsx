import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export const metadata: Metadata = {
  title: 'Football Accessories Blog | LeMah',
  description: 'Expert guides on football accessories, Real Madrid kits, and goalkeeper gear in Dubai & UAE. Buying guides, sizing tips, and authenticity checks.',
}

interface BlogPost {
  slug: string
  title: string
  date: string
  meta_description: string
  focus_keyword: string
  theme: string
}

function getAllPosts(): BlogPost[] {
  try {
    const postsDirectory = join(process.cwd(), 'content/blog')
    const fs = require('fs')
    
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return []
    }
    
    const files = fs.readdirSync(postsDirectory)
    
    const posts = files
      .filter((file: string) => file.endsWith('.mdx') || file.endsWith('.md'))
      .map((file: string) => {
        try {
          const filePath = join(postsDirectory, file)
          const fileContents = fs.readFileSync(filePath, 'utf8')
          const { data } = matter(fileContents)
          return {
            slug: data.slug || file.replace(/\.(mdx|md)$/, ''),
            title: data.title || '',
            date: data.date || new Date().toISOString(),
            meta_description: data.meta_description || '',
            focus_keyword: data.focus_keyword || '',
            theme: data.theme || 'Accessories',
          }
        } catch (error) {
          console.error(`Error reading blog post ${file}:`, error)
          return null
        }
      })
      .filter((post: BlogPost | null): post is BlogPost => post !== null)
      .sort((a: BlogPost, b: BlogPost) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
    
    return posts
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
            {Object.entries(groupedByTheme).map(([theme, themePosts]) => (
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
            ))}

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
