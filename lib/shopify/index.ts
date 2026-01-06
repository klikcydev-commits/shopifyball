import { shopifyFetch } from './fetch'
import {
  getMenuQuery,
  getProductQuery,
  getProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
  createCartMutation,
  addToCartMutation,
  updateCartMutation,
  removeFromCartMutation,
  getCartQuery,
} from './queries'
import type { ShopifyProduct, ShopifyCollection, ShopifyMenu, ShopifyCart } from './types'

export async function getMenu(handle: string): Promise<ShopifyMenu | null> {
  const res = await shopifyFetch<{ data: { menu: ShopifyMenu | null } }>({
    query: getMenuQuery,
    variables: { handle },
    cache: 'no-store', // Always fetch fresh menu from Shopify
  })

  return res.body.data.menu
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const res = await shopifyFetch<{ data: { product: ShopifyProduct | null } }>({
    query: getProductQuery,
    variables: { handle },
    cache: 'no-store',
  })

  return res.body.data.product
}

export async function getProducts({
  query,
  first = 12,
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
  const res = await shopifyFetch<{
    data: {
      products: {
        edges: Array<{ node: ShopifyProduct }>
        pageInfo: {
          hasNextPage: boolean
          hasPreviousPage: boolean
          startCursor: string
          endCursor: string
        }
      }
    }
  }>({
    query: getProductsQuery,
    variables: {
      query,
      first,
    },
    cache: 'no-store', // Always fetch fresh products from Shopify
  })

  return {
    products: res.body.data.products.edges.map((edge) => edge.node),
    pageInfo: res.body.data.products.pageInfo,
  }
}

export async function getCollection(
  handle: string,
  first: number = 12,
  after?: string
): Promise<ShopifyCollection | null> {
  const res = await shopifyFetch<{ data: { collection: ShopifyCollection | null } }>({
    query: getCollectionQuery,
    variables: { handle, first, after },
    cache: 'no-store', // Always fetch fresh collection data from Shopify
  })

  return res.body.data.collection
}

export async function getCollections(first: number = 12): Promise<ShopifyCollection[]> {
  const res = await shopifyFetch<{
    data: {
      collections: {
        edges: Array<{ node: ShopifyCollection }>
      }
    }
  }>({
    query: getCollectionsQuery,
    variables: { first },
    cache: 'no-store', // Always fetch fresh collections from Shopify
  })

  return res.body.data.collections.edges.map((edge) => edge.node)
}

export async function createCart(variantId: string, quantity: number = 1): Promise<ShopifyCart | null> {
  const res = await shopifyFetch<{
    data: {
      cartCreate: {
        cart: ShopifyCart | null
        userErrors: Array<{ field: string[]; message: string }>
      }
    }
  }>({
    query: createCartMutation,
    variables: {
      input: {
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      },
    },
    cache: 'no-store',
  })

  if (res.body.data.cartCreate.userErrors.length > 0) {
    throw new Error(res.body.data.cartCreate.userErrors[0].message)
  }

  return res.body.data.cartCreate.cart
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart | null> {
  const res = await shopifyFetch<{
    data: {
      cartLinesAdd: {
        cart: ShopifyCart | null
        userErrors: Array<{ field: string[]; message: string }>
      }
    }
  }>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    },
    cache: 'no-store',
  })

  if (res.body.data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(res.body.data.cartLinesAdd.userErrors[0].message)
  }

  return res.body.data.cartLinesAdd.cart
}

export async function updateCart(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  const res = await shopifyFetch<{
    data: {
      cartLinesUpdate: {
        cart: ShopifyCart | null
        userErrors: Array<{ field: string[]; message: string }>
      }
    }
  }>({
    query: updateCartMutation,
    variables: {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
        },
      ],
    },
    cache: 'no-store',
  })

  if (res.body.data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(res.body.data.cartLinesUpdate.userErrors[0].message)
  }

  return res.body.data.cartLinesUpdate.cart
}

export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart | null> {
  const res = await shopifyFetch<{
    data: {
      cartLinesRemove: {
        cart: ShopifyCart | null
        userErrors: Array<{ field: string[]; message: string }>
      }
    }
  }>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds: [lineId],
    },
    cache: 'no-store',
  })

  if (res.body.data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(res.body.data.cartLinesRemove.userErrors[0].message)
  }

  return res.body.data.cartLinesRemove.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const res = await shopifyFetch<{ data: { cart: ShopifyCart | null } }>({
    query: getCartQuery,
    variables: { id: cartId },
    cache: 'no-store',
  })

  return res.body.data.cart
}


