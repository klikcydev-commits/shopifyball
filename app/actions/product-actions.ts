'use server'

import { getCollection, getCollections, getProducts, getAllProducts, getAllCollectionProducts } from '@/lib/shopify'
import type { ShopifyCollection, ShopifyProduct } from '@/lib/shopify/types'

/** Shuffle array and return a new array (Fisher–Yates). */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Pick up to `count` random items from array (no duplicates). */
function pickRandom<T>(arr: T[], count: number): T[] {
  if (arr.length <= count) return shuffle(arr)
  const shuffled = shuffle(arr)
  return shuffled.slice(0, count)
}

/**
 * Featured "Premium Picks": 6 products total — 2 randomly chosen from each of 3 collections.
 * Falls back to general products if fewer than 3 collections or not enough products.
 */
export async function getFeaturedProductsAction(): Promise<{ products: ShopifyProduct[] }> {
  const perCollection = 2
  const totalWanted = 6
  const collectionCount = 3

  try {
    const collections = await getCollections(10)
    const toUse = collections.slice(0, collectionCount).filter((c) => c?.handle)

    if (toUse.length === 0) {
      const { products } = await getProducts({ first: totalWanted })
      return { products }
    }

    const byCollection: ShopifyProduct[] = []
    for (const col of toUse) {
      const coll = await getCollection(col.handle, 12)
      if (!coll?.products?.edges?.length) continue
      const nodes = coll.products.edges.map((e) => e.node)
      const picked = pickRandom(nodes, perCollection)
      byCollection.push(...picked)
    }

    if (byCollection.length >= totalWanted) {
      return { products: shuffle(byCollection).slice(0, totalWanted) }
    }

    const { products } = await getProducts({ first: totalWanted })
    const existingIds = new Set(byCollection.map((p) => p.id))
    const extra = products.filter((p) => !existingIds.has(p.id)).slice(0, totalWanted - byCollection.length)
    return { products: shuffle([...byCollection, ...extra]) }
  } catch {
    const { products } = await getProducts({ first: totalWanted })
    return { products }
  }
}

export async function getCollectionAction(
  handle: string,
  first: number = 24
): Promise<ShopifyCollection | null> {
  return getCollection(handle, first)
}

export async function getProductsAction({
  query,
  first = 24,
}: {
  query?: string
  first?: number
}): Promise<{
  products: ShopifyProduct[]
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string
    endCursor: string
  }
}> {
  return getProducts({ query, first })
}

/** Fetches every product from Shopify (paginates until done). Use for "All Products" so none are missed. */
export async function getAllProductsAction(options?: { query?: string }): Promise<{
  products: ShopifyProduct[]
  error?: string
}> {
  try {
    const products = await getAllProducts(options)
    return { products }
  } catch (err) {
    console.error('[getAllProductsAction]', err)
    return { products: [], error: err instanceof Error ? err.message : 'Failed to fetch products' }
  }
}

/** Fetches every product in a collection (paginates until done). */
export async function getAllCollectionProductsAction(handle: string): Promise<{
  products: ShopifyProduct[]
  error?: string
}> {
  try {
    const products = await getAllCollectionProducts(handle)
    return { products }
  } catch (err) {
    console.error('[getAllCollectionProductsAction]', err)
    return { products: [], error: err instanceof Error ? err.message : 'Failed to fetch collection products' }
  }
}



