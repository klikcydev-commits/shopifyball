import { getPromotions } from "@/lib/promotions"
import { Truck } from "lucide-react"

/**
 * Server component: shows a global promo banner when any Shopify discount is active.
 * Uses title + summary from Admin API; does not hardcode discount names or rules.
 */
export async function PromoBanner() {
  const { hasActivePromos, promos } = await getPromotions()

  if (!hasActivePromos || promos.length === 0) return null

  const hasFreeShipping = promos.some((p) => p.kind === "free_shipping")

  return (
    <div
      role="banner"
      className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className="font-semibold uppercase tracking-wide">
          Best Deals Active
        </span>
        {hasFreeShipping && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
            <Truck className="h-3 w-3" aria-hidden />
            Free Shipping on 2+ items!
          </span>
        )}
      </div>
      <ul className="mt-1.5 space-y-0.5 text-xs opacity-95">
        {promos.slice(0, 5).map((p) => (
          <li key={`${p.kind}-${p.title}`}>
            {p.title}
            {p.summary ? ` — ${p.summary}` : ""}
          </li>
        ))}
      </ul>
    </div>
  )
}
