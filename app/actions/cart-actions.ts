'use server'

import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  createCart,
} from '@/lib/shopify'
import type { ShopifyCart } from '@/lib/shopify/types'

export async function getCartAction(cartId: string): Promise<ShopifyCart | null> {
  return getCart(cartId)
}

export async function addToCartAction(
  cartId: string | null,
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart | null> {
  if (cartId) {
    return addToCart(cartId, variantId, quantity)
  } else {
    return createCart(variantId, quantity)
  }
}

export async function updateCartAction(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  return updateCart(cartId, lineId, quantity)
}

export async function removeFromCartAction(
  cartId: string,
  lineId: string
): Promise<ShopifyCart | null> {
  return removeFromCart(cartId, lineId)
}

export async function createCartAction(
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart | null> {
  return createCart(variantId, quantity)
}



