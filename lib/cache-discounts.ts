import { unstable_cache } from "next/cache"
import type { Product } from "@/lib/shopify-types"
import type { ActiveDiscount, ActiveDiscountsResponse } from "@/app/api/active-discounts/route"

const CACHE_TAG = "discounts"
const REVALIDATE_SECONDS = 300

async function fetchActiveDiscountsFromApi(): Promise<ActiveDiscountsResponse> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${base}/api/active-discounts`, { next: { revalidate: 60 } })
  if (!res.ok) return { active: false, discounts: [] }
  const data = await res.json()
  return {
    active: Boolean(data.active),
    discounts: Array.isArray(data.discounts) ? data.discounts : [],
  }
}

/**
 * Cached access to active discounts (server-side).
 * Revalidates every 5 minutes; use revalidateTag('discounts') to invalidate on discount changes.
 */
export async function getCachedDiscounts(): Promise<ActiveDiscountsResponse> {
  return unstable_cache(
    fetchActiveDiscountsFromApi,
    ["active-discounts"],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
  )()
}

/**
 * Find the first active discount that applies to this product (by collection or product ID).
 * Prefers collection-based match; product IDs are not currently returned by our API for DiscountProducts.
 */
export function findApplicableDiscount(
  product: Pick<Product, "id" | "collectionIds">,
  discounts: ActiveDiscount[]
): ActiveDiscount | null {
  const collectionIds = product.collectionIds ?? []
  for (const d of discounts) {
    if (d.collectionIds.some((cid) => collectionIds.includes(cid))) return d
  }
  return null
}

/**
 * DO NOT use for product card or PDP display. Shopify variant.price is already the final price.
 * Automatic/code discounts apply only at cart/checkout; use Cart API cost/discountAllocations for those.
 * This helper exists only for server-side logic that must not drive product grid or PDP pricing.
 */
export function getDisplayPricesForDiscount(
  currentPrice: string,
  discount: ActiveDiscount
): { displayPrice: string; compareAtPrice: string } {
  const num = parseFloat(String(currentPrice))
  if (Number.isNaN(num) || discount.percentage <= 0) {
    return { displayPrice: currentPrice, compareAtPrice: currentPrice }
  }
  const discounted = num * (1 - discount.percentage / 100)
  return {
    displayPrice: discounted.toFixed(2),
    compareAtPrice: num.toFixed(2),
  }
}
