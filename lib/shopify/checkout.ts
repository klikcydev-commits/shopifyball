/**
 * Helper functions for redirecting to shop.lemah.com for checkout.
 * Cart is passed via Shopify cart permalink: /cart/variantId:qty,variantId:qty
 * Shopify expects numeric variant IDs (Storefront API returns GIDs).
 */

// Must match your live Shopify store URL (with valid SSL). Set in .env.local:
// NEXT_PUBLIC_SHOPIFY_STORE_URL=https://your-store.myshopify.com or your custom domain
const SHOPIFY_STORE_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL || 'https://shop.leamah.store'

/**
 * Convert Shopify GID to numeric ID for cart URL.
 * e.g. gid://shopify/ProductVariant/44123456789 -> 44123456789
 */
function toNumericVariantId(id: string): string {
  if (!id) return id
  const parts = id.split('/')
  const last = parts[parts.length - 1]
  return last || id
}

/**
 * Build checkout URL for shop.lemah.com.
 * Sends the customer's cart to Shopify so the same items open in the store cart.
 * Format: /cart/[numeric-variant-id]:[quantity],[numeric-variant-id]:[quantity]
 */
export function buildCheckoutUrl(
  cartItems: Array<{ variantId: string; quantity: number; productHandle?: string }>
): string {
  if (cartItems.length === 0) {
    return `${SHOPIFY_STORE_URL}/cart`
  }

  const items = cartItems
    .map((item) => `${toNumericVariantId(item.variantId)}:${item.quantity}`)
    .join(',')
  return `${SHOPIFY_STORE_URL}/cart/${items}`
}

/**
 * Build product URL for shop.lemah.com
 */
export function buildProductUrl(handle: string): string {
  return `${SHOPIFY_STORE_URL}/products/${handle}`
}

/**
 * Build checkout URL from Shopify cart checkout URL.
 * Redirects to shop.lemah.com cart.
 */
export function convertCheckoutUrl(shopifyCheckoutUrl: string | null | undefined): string {
  if (!shopifyCheckoutUrl) {
    return `${SHOPIFY_STORE_URL}/cart`
  }
  
  // Extract cart ID from checkout URL if possible
  // Shopify checkout URLs are typically: https://checkout.shopify.com/carts/[cart-id]/checkouts/[checkout-id]
  // Redirect to cart on shop.lemah.com
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
