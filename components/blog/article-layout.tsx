import type { ReactNode } from 'react'

interface ArticleLayoutProps {
  children: ReactNode
  /** Optional class for the outer wrapper */
  className?: string
}

/**
 * Professional blog article wrapper: max reading width, consistent spacing, typography.
 * Use for all blog posts. Body content should sit inside .article-body (700-780px).
 */
export function ArticleLayout({ children, className = '' }: ArticleLayoutProps) {
  return (
    <article
      className={`article-layout mx-auto w-full max-w-[780px] px-4 sm:px-6 py-10 sm:py-14 ${className}`}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <div className="article-body text-[1rem] sm:text-[1.0625rem] leading-[1.7] space-y-10 sm:space-y-12">
        {children}
      </div>
    </article>
  )
}
