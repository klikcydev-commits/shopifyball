'use server'

import {
  getCart,
  createCart,
  addLines,
  updateLines,
  removeLines,
} from '@/lib/shopify/cart'
import { applyDiscountCodes, createCartWithLine } from '@/lib/shopify'
import type { ShopifyCart } from '@/lib/shopify/types'

/** Fetch cart by ID. Returns null if not found or expired. */
export async function getCartAction(cartId: string): Promise<ShopifyCart | null> {
  return getCart(cartId)
}

/**
 * Add item to cart. If no cartId, creates a new cart then adds the line.
 * Uses Shopify as single source of truth.
 */
export async function addToCartAction(
  cartId: string | null,
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart | null> {
  const line = [{ merchandiseId: variantId, quantity }]
  if (cartId) {
    return addLines(cartId, line)
  }
  try {
    const newCart = await createCart()
    if (!newCart) return null
    return addLines(newCart.id, line)
  } catch {
    return createCartWithLine(variantId, quantity)
  }
}

export async function updateCartAction(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  return updateLines(cartId, [{ id: lineId, quantity }])
}

export async function removeFromCartAction(
  cartId: string,
  lineId: string
): Promise<ShopifyCart | null> {
  return removeLines(cartId, [lineId])
}

/**
 * Apply or replace discount codes on the cart. Pass full list of codes to keep (e.g. add one or remove one).
 * Replaces all existing codes. Throws on Shopify userErrors (e.g. invalid code).
 */
export async function applyDiscountCodesAction(
  cartId: string,
  discountCodes: string[]
): Promise<ShopifyCart | null> {
  return applyDiscountCodes(cartId, discountCodes)
}
