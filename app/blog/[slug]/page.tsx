import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { HomeSeoSections } from '@/components/home/home-seo-sections'
import { FeaturedProducts } from '@/components/home/featured-products'
import { join } from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArticleLayout } from '@/components/blog/article-layout'
import { blogMdxComponents } from '@/components/blog/mdx-components'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

function getPost(slug: string) {
  try {
    const blogDir = join(process.cwd(), 'content/blog')
    const postsSubdir = join(blogDir, 'posts')

    // Prefer content/blog/posts/<slug>.mdx, then content/blog/<slug>.mdx or .md
    let filePath = join(postsSubdir, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      filePath = join(blogDir, `${slug}.mdx`)
    }
    if (!fs.existsSync(filePath)) {
      const mdPath = join(blogDir, `${slug}.md`)
      if (fs.existsSync(mdPath)) {
        const fileContents = fs.readFileSync(mdPath, 'utf8')
        const { data, content } = matter(fileContents)
        return { data, content }
      }
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    return { data, content }
  } catch (error) {
    console.error('Error reading blog post:', error)
    return null
  }
}

function getMeta(slug: string): Record<string, unknown> | null {
  try {
    const metaPath = join(process.cwd(), 'content/blog/meta', `${slug}.json`)
    if (!fs.existsSync(metaPath)) return null
    const raw = fs.readFileSync(metaPath, 'utf8')
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  const meta = getMeta(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const title = (meta?.title as string) || post.data.meta_title || post.data.title
  const description = (meta?.description as string) || post.data.meta_description || post.data.title
  const canonicalUrl = (meta?.canonical as string) || post.data.canonical_url
  const ogTitle = (meta?.ogTitle as string) || title
  const ogDescription = (meta?.ogDescription as string) || description
  const publishedTime = (meta?.datePublished as string) || post.data.date

  const keywords = [
    ...(meta?.focusKeyword ? [meta.focusKeyword as string] : []),
    ...(Array.isArray(meta?.secondaryKeywords) ? (meta.secondaryKeywords as string[]) : []),
    ...(Array.isArray(post.data.focus_keyword) ? post.data.focus_keyword : post.data.focus_keyword ? [post.data.focus_keyword] : []),
    ...(Array.isArray(post.data.secondary_keywords) ? post.data.secondary_keywords : []),
  ].filter(Boolean) as string[]

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      publishedTime: publishedTime || undefined,
      url: canonicalUrl || undefined,
    },
  }
  if (canonicalUrl) {
    metadata.alternates = { canonical: canonicalUrl }
  }
  if (keywords.length > 0) {
    metadata.keywords = keywords
  }
  return metadata
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    notFound()
  }

  const { data, content } = post
  const meta = getMeta(slug)
  const datePublished = (meta?.datePublished as string) || data.date
  const dateModified = (meta?.dateModified as string) || data.dateModified || data.date
  const schemaDescription = (meta?.description as string) || data.meta_description || data.title
  const headline = (meta?.title as string) || data.title
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lemah.store'
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    datePublished,
    dateModified,
    author: { '@type': 'Organization', name: 'Lemah' },
    publisher: { '@type': 'Organization', name: 'Lemah' },
    description: schemaDescription,
    url: (meta?.canonical as string) || data.canonical_url || `${baseUrl}/blog/${slug}`,
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <HeroSection />
        <HomeSeoSections />
        <FeaturedProducts />
        <ArticleLayout>
          {(meta?.city as string) || data.theme ? (
            <header className="mb-8">
              <span className="text-sm uppercase tracking-wider text-muted-foreground">
                {(meta?.city as string) || data.theme}
              </span>
              {(datePublished || data.date) && (
                <time
                  className="block mt-1 text-sm text-muted-foreground"
                  dateTime={datePublished || data.date}
                >
                  {new Date(datePublished || data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </header>
          ) : null}
          <div className="article-body prose-headings:font-semibold">
            <MDXRemote
              source={content}
              components={blogMdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [],
                  rehypePlugins: [],
                },
              }}
            />
          </div>
        </ArticleLayout>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </main>
      <Footer />
    </>
  )
}
