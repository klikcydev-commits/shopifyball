/**
 * Helper functions for redirecting to shop.leamah for checkout
 */

const SHOPIFY_STORE_URL = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL || 'https://shop.leamah.store'

/**
 * Build checkout URL for shop.lemah.store
 * Takes cart items with product handles and redirects to Shopify store cart
 * Format: /cart/[variant-id]:[quantity],[variant-id]:[quantity]
 */
export function buildCheckoutUrl(
  cartItems: Array<{ variantId: string; quantity: number; productHandle?: string }>
): string {
  if (cartItems.length === 0) {
    return `${SHOPIFY_STORE_URL}/cart`
  }
  
  // Build cart URL with items in format: /cart/[variant-id]:[quantity],[variant-id]:[quantity]
  const items = cartItems.map(item => `${item.variantId}:${item.quantity}`).join(',')
  return `${SHOPIFY_STORE_URL}/cart/${items}`
}

/**
 * Build product URL for shop.lemah.store
 */
export function buildProductUrl(handle: string): string {
  return `${SHOPIFY_STORE_URL}/products/${handle}`
}

/**
 * Build checkout URL from Shopify cart checkout URL
 * Converts the checkout URL to point to shop.lemah.store
 */
export function convertCheckoutUrl(shopifyCheckoutUrl: string | null | undefined): string {
  if (!shopifyCheckoutUrl) {
    return `${SHOPIFY_STORE_URL}/cart`
  }
  
  // Extract cart ID from checkout URL if possible
  // Shopify checkout URLs are typically: https://checkout.shopify.com/carts/[cart-id]/checkouts/[checkout-id]
  // We'll redirect to the cart page on shop.lemah.store
  try {
    const url = new URL(shopifyCheckoutUrl)
    // If it's a checkout URL, redirect to cart page
    if (url.pathname.includes('/checkouts/')) {
      return `${SHOPIFY_STORE_URL}/cart`
    }
  } catch {
    // If URL parsing fails, just redirect to cart
  }
  
  return `${SHOPIFY_STORE_URL}/cart`
}
