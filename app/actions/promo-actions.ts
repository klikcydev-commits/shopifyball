'use server'

import { getProducts } from '@/lib/shopify'
import { adaptShopifyProduct } from '@/lib/shopify/adapter'

export type HeaderPromo = {
  hasDeals: boolean
  saleCount: number
}

/**
 * Returns true if this product has a compare-at discount (product or any variant).
 */
function productHasDeal(p: ReturnType<typeof adaptShopifyProduct>): boolean {
  const price = parseFloat(p.price || '0')
  const compareAt = p.compareAtPrice ? parseFloat(p.compareAtPrice) : null
  if (compareAt != null && !Number.isNaN(compareAt) && compareAt > price) return true
  // Fallback: check variants in case product-level compareAtPrice wasn't set by API
  return (p.variants ?? []).some(
    (v) =>
      v.compareAtPrice &&
      parseFloat(v.compareAtPrice!) > parseFloat(v.price)
  )
}

/**
 * Fetches products from Shopify and detects if any have a compare-at discount.
 * Used by the header banner to show "SALE" when there are deals.
 */
export async function getHeaderPromoAction(): Promise<HeaderPromo> {
  try {
    const { products } = await getProducts({ first: 48 })
    const adapted = products.map(adaptShopifyProduct)
    const saleCount = adapted.filter(productHasDeal).length
    return { hasDeals: saleCount > 0, saleCount }
  } catch (e) {
    console.error('[getHeaderPromoAction]', e)
    return { hasDeals: false, saleCount: 0 }
  }
}
