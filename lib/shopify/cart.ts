/**
 * Shopify Cart Service (Storefront API)
 * Single source of truth: all cart state comes from Shopify.
 * Use cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove, cart query.
 */

import { shopifyFetch } from "./fetch"
import {
  createCartMutation,
  addToCartMutation,
  updateCartMutation,
  removeFromCartMutation,
  getCartQuery,
} from "./queries"
import type { ShopifyCart } from "./types"

export interface CartLineInput {
  merchandiseId: string
  quantity: number
}

export interface CartLineUpdateInput {
  id: string
  quantity: number
}

/**
 * Create an empty Shopify cart. Use addLines to add items.
 */
export async function createCart(): Promise<ShopifyCart | null> {
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
        lines: [],
      },
    },
    cache: "no-store",
  })

  const payload = res.body.data.cartCreate
  if (payload.userErrors.length > 0) {
    throw new Error(payload.userErrors[0].message)
  }
  return payload.cart
}

/**
 * Fetch cart by ID. Returns null if cart not found or expired.
 */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const res = await shopifyFetch<{ data: { cart: ShopifyCart | null } }>({
    query: getCartQuery,
    variables: { id: cartId },
    cache: "no-store",
  })
  return res.body.data.cart
}

/**
 * Add lines to an existing cart.
 * @param lines - Array of { merchandiseId (variant GID), quantity }
 */
export async function addLines(
  cartId: string,
  lines: CartLineInput[]
): Promise<ShopifyCart | null> {
  if (lines.length === 0) return getCart(cartId)

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
      lines: lines.map((l) => ({ merchandiseId: l.merchandiseId, quantity: l.quantity })),
    },
    cache: "no-store",
  })

  const payload = res.body.data.cartLinesAdd
  if (payload.userErrors.length > 0) {
    throw new Error(payload.userErrors[0].message)
  }
  return payload.cart
}

/**
 * Update line quantities.
 * @param lines - Array of { id (line GID), quantity }
 */
export async function updateLines(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<ShopifyCart | null> {
  if (lines.length === 0) return getCart(cartId)

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
      lines: lines.map((l) => ({ id: l.id, quantity: l.quantity })),
    },
    cache: "no-store",
  })

  const payload = res.body.data.cartLinesUpdate
  if (payload.userErrors.length > 0) {
    throw new Error(payload.userErrors[0].message)
  }
  return payload.cart
}

/**
 * Remove lines by ID. If a line "does not exist", refetches cart and returns it (no throw).
 */
export async function removeLines(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart | null> {
  if (lineIds.length === 0) return getCart(cartId)

  const res = await shopifyFetch<{
    data: {
      cartLinesRemove: {
        cart: ShopifyCart | null
        userErrors: Array<{ field: string[]; message: string }>
      }
    }
  }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  })

  const payload = res.body.data.cartLinesRemove
  if (payload.userErrors.length > 0) {
    const msg = payload.userErrors[0].message ?? ""
    if (msg.toLowerCase().includes("does not exist") || msg.toLowerCase().includes("not found")) {
      return getCart(cartId)
    }
    throw new Error(msg)
  }
  return payload.cart
}
