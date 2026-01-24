import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

function getPost(slug: string) {
  try {
    const postsDirectory = join(process.cwd(), 'content/blog')
    const fs = require('fs')
    const filePath = join(postsDirectory, `${slug}.mdx`)
    
    if (!fs.existsSync(filePath)) {
      // Try .md extension
      const mdPath = join(postsDirectory, `${slug}.md`)
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.data.meta_title || post.data.title,
    description: post.data.meta_description,
    keywords: post.data.focus_keyword,
    openGraph: {
      title: post.data.meta_title || post.data.title,
      description: post.data.meta_description,
      type: 'article',
      publishedTime: post.data.date,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    notFound()
  }

  const { data, content } = post

  // Generate JSON-LD schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    datePublished: data.date,
    dateModified: data.dateModified || data.date,
    author: {
      '@type': 'Organization',
      name: 'LeMah',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LeMah',
    },
    description: data.meta_description,
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-4">
              <span className="text-sm uppercase tracking-wider text-muted-foreground">
                {data.theme || 'Accessories'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
            {data.date && (
              <time className="text-sm text-muted-foreground">
                {new Date(data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
            <MDXRemote 
              source={content}
              options={{
                mdxOptions: {
                  remarkPlugins: [],
                  rehypePlugins: [],
                },
              }}
            />
          </div>

          {/* JSON-LD Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
        </article>
      </main>
      <Footer />
    </>
  )
}
