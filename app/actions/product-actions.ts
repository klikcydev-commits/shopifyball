'use server'

import { getCollection, getProducts } from '@/lib/shopify'
import type { ShopifyCollection, ShopifyProduct } from '@/lib/shopify/types'

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



