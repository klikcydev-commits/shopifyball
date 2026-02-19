"use client"

import { useState } from "react"

interface BlogReadMoreToggleProps {
  children: React.ReactNode
  /** Only render toggle when there is content to expand */
  hasContent?: boolean
}

export function BlogReadMoreToggle({ children, hasContent = true }: BlogReadMoreToggleProps) {
  const [expanded, setExpanded] = useState(false)

  if (!hasContent) return null

  return (
    <div className="flex flex-col items-center w-full">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-primary font-medium uppercase tracking-wider hover:bg-gold/90 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        aria-expanded={expanded}
        aria-controls="article-content"
        id="read-more-toggle"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
      <div
        id="article-content"
        className={expanded ? "w-full mt-8" : "sr-only"}
        aria-hidden={!expanded}
        role="region"
        aria-labelledby="read-more-toggle"
      >
        {children}
      </div>
    </div>
  )
}
