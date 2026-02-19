interface SizingCard {
  label: string
  description: string
}

interface SizingCardsProps {
  title?: string
  cards: SizingCard[]
}

/**
 * Compact sizing section as cards (e.g. XS, S, M, L, XL with short descriptions).
 */
export function SizingCards({ title = 'Sizing & fit', cards }: SizingCardsProps) {
  const list = Array.isArray(cards) ? cards : []
  return (
    <div className="sizing-cards not-prose">
      {title && (
        <h3 className="text-base font-semibold text-foreground mb-4">{title}</h3>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {list.map((card, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-card p-3 text-left"
          >
            <span className="font-medium text-foreground text-sm block mb-1">
              {card.label}
            </span>
            <span className="text-xs text-muted-foreground leading-snug">
              {card.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
