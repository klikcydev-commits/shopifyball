import Link from 'next/link'

export interface RelatedArticle {
  slug: string
  title: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
  title?: string
}

/**
 * Card grid of related blog posts. Slugs link to /blog/<slug>.
 */
export function RelatedArticles({
  articles,
  title = 'Related articles',
}: RelatedArticlesProps) {
  const list = Array.isArray(articles) ? articles : []
  if (!list.length) return null

  return (
    <section className="related-articles not-prose" aria-label={title}>
      <h2 className="text-xl font-semibold text-foreground mb-5">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="block rounded-lg border border-border bg-card p-4 hover:border-gold/50 hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <span className="font-medium text-foreground text-sm line-clamp-2">
              {a.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
