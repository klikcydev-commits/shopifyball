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

/** Search products by query (e.g. header search dialog). Uses Shopify product search; returns up to 12 matches. */
export async function searchProductsAction(query: string | null): Promise<{
  products: ShopifyProduct[]
  error?: string
}> {
  const q = (query ?? '').trim()
  if (!q) return { products: [] }
  try {
    const { products } = await getProducts({
      first: 12,
      query: q,
    })
    return { products }
  } catch (err) {
    console.error('[searchProductsAction]', err)
    return { products: [], error: err instanceof Error ? err.message : 'Search failed' }
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

const RANDOM_PICKS_WANTED = 6
/** Six products, mostly CR7 (Ronaldo), then Legends or general. For "Random Picks" + "X people bought" section. */
export async function getRandomPoolProductsAction(): Promise<{ products: ShopifyProduct[] }> {
  try {
    const cr7 = await getCollection('cr7', 20)
    const legends = await getCollection('legends', 20)
    const cr7Products = cr7?.products?.edges?.map((e) => e.node) ?? []
    const legendsProducts = legends?.products?.edges?.map((e) => e.node) ?? []
    const seenIds = new Set<string>()
    const result: ShopifyProduct[] = []
    const fromCr7 = pickRandom(cr7Products.filter((p) => !seenIds.has(p.id)), 4)
    fromCr7.forEach((p) => {
      seenIds.add(p.id)
      result.push(p)
    })
    const fromLegends = pickRandom(
      legendsProducts.filter((p) => !seenIds.has(p.id)),
      RANDOM_PICKS_WANTED - result.length
    )
    fromLegends.forEach((p) => {
      seenIds.add(p.id)
      result.push(p)
    })
    if (result.length >= RANDOM_PICKS_WANTED) {
      return { products: shuffle(result).slice(0, RANDOM_PICKS_WANTED) }
    }
    const { products: general } = await getProducts({ first: 24 })
    const extra = general.filter((p) => !seenIds.has(p.id))
    const filled = [...result, ...pickRandom(extra, RANDOM_PICKS_WANTED - result.length)]
    return { products: shuffle(filled).slice(0, RANDOM_PICKS_WANTED) }
  } catch {
    const { products } = await getProducts({ first: 24 })
    return { products: pickRandom(products, RANDOM_PICKS_WANTED) }
  }
}

/** Lookbook: 9 random products, evenly spread across all collections. Used for lookbook grid. */
export async function getLookbookProductsAction(): Promise<{ products: ShopifyProduct[] }> {
  const wanted = 9
  try {
    const collections = await getCollections(20)
    const withHandle = collections.filter((c) => c?.handle).slice(0, 15)
    if (withHandle.length === 0) {
      const { products } = await getProducts({ first: wanted })
      return { products: pickRandom(products, wanted) }
    }
    const perCollection = Math.max(1, Math.ceil(wanted / withHandle.length))
    const byCollection: ShopifyProduct[] = []
    const seenIds = new Set<string>()
    for (const col of withHandle) {
      const coll = await getCollection(col.handle, 12)
      if (!coll?.products?.edges?.length) continue
      const nodes = coll.products.edges.map((e) => e.node).filter((p) => !seenIds.has(p.id))
      const picked = pickRandom(nodes, perCollection)
      for (const p of picked) {
        seenIds.add(p.id)
        byCollection.push(p)
      }
      if (byCollection.length >= wanted) break
    }
    const result = shuffle(byCollection).slice(0, wanted)
    if (result.length >= wanted) return { products: result }
    const { products } = await getProducts({ first: wanted * 2 })
    const extra = products.filter((p) => !seenIds.has(p.id))
    const filled = [...result, ...pickRandom(extra, wanted - result.length)]
    return { products: shuffle(filled).slice(0, wanted) }
  } catch {
    const { products } = await getProducts({ first: wanted })
    return { products: pickRandom(products, wanted) }
  }
}



