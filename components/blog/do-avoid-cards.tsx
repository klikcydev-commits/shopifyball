import type { ReactNode } from 'react'

interface DoAvoidCardsProps {
  doTitle?: string
  avoidTitle?: string
  doItems: ReactNode[]
  avoidItems: ReactNode[]
}

/**
 * Two-column Do / Avoid layout for authenticity or quality checks.
 */
export function DoAvoidCards({
  doTitle = 'Do',
  avoidTitle = 'Avoid',
  doItems,
  avoidItems,
}: DoAvoidCardsProps) {
  const doList = Array.isArray(doItems) ? doItems : []
  const avoidList = Array.isArray(avoidItems) ? avoidItems : []
  return (
    <div className="do-avoid-cards grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          {doTitle}
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
          {doList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          {avoidTitle}
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
          {avoidList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
