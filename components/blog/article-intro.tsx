import type { ReactNode } from 'react'

interface ArticleIntroProps {
  children: ReactNode
}

/**
 * 1-2 paragraph intro block for blog articles. Slightly larger, muted.
 */
export function ArticleIntro({ children }: ArticleIntroProps) {
  return (
    <div className="article-intro text-lg sm:text-[1.125rem] leading-[1.75] text-muted-foreground space-y-4">
      {children}
    </div>
  )
}
