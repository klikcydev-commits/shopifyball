import Link from 'next/link'

interface ProductCTAProps {
  /** Primary CTA label */
  title?: string
  /** Secondary link label (e.g. "Browse gifts") */
  secondaryLabel?: string
  secondaryHref?: string
}

/**
 * Shop Now / CTA block: buttons linking to /shop and optional landing page.
 */
export function ProductCTA({
  title = 'Shop Football Accessories',
  secondaryLabel = 'Football gifts',
  secondaryHref = '/football-gifts-dubai',
}: ProductCTAProps) {
  return (
    <section
      className="product-cta rounded-lg border border-border bg-muted/30 p-6 sm:p-8 text-center not-prose"
      aria-label="Shop now"
    >
      <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-gold text-[#2d4b62] font-medium text-sm hover:bg-gold/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          Shop Now
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-md border border-border bg-background font-medium text-sm hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  )
}
