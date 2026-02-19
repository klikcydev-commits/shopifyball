import type { ReactNode } from 'react'

type CalloutType = 'uae' | 'tip' | 'info'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const defaultTitles: Record<CalloutType, string> = {
  uae: 'Why this matters in the UAE',
  tip: 'Tip',
  info: 'Note',
}

/**
 * Styled callout block: border + background. Use type="uae" for UAE-specific context.
 */
export function Callout({ type = 'uae', title, children }: CalloutProps) {
  const displayTitle = title ?? defaultTitles[type]
  const isUae = type === 'uae'

  return (
    <aside
      className="callout rounded-lg border border-border bg-muted/40 p-5 sm:p-6 not-prose"
      aria-label={displayTitle}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
        {displayTitle}
      </h3>
      <div className={`text-[0.9375rem] leading-relaxed ${isUae ? 'text-muted-foreground' : ''}`}>
        {children}
      </div>
    </aside>
  )
}
