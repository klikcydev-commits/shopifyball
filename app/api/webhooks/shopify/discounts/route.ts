import { NextResponse } from "next/server"

/**
 * Shopify webhook: discount create/update/delete.
 * Configure in Shopify Admin: Settings → Notifications → Webhooks →
 *   "Discount creation" / "Discount deletion" → URL: https://your-domain.com/api/webhooks/shopify/discounts
 *
 * When a discount is activated you can:
 * - Fetch products in the discount's collections
 * - Calculate discounted prices
 * - Call updateProductVariantPrice (lib/shopify-admin) to set compareAtPrice and price
 *
 * When a discount is deactivated you can reset compareAtPrice.
 *
 * Verify webhook with X-Shopify-Hmac-Sha256 before processing.
 */
export async function POST(request: Request) {
  const hmac = request.headers.get("x-shopify-hmac-sha256")
  if (!hmac) {
    return NextResponse.json({ error: "Missing HMAC" }, { status: 401 })
  }

  const rawBody = await request.text()
  // TODO: verify HMAC using SHOPIFY_WEBHOOK_SECRET
  // const valid = verifyShopifyWebhook(rawBody, hmac, process.env.SHOPIFY_WEBHOOK_SECRET!)
  // if (!valid) return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 })

  let payload: { id?: number; status?: string; [key: string]: unknown }
  try {
    payload = JSON.parse(rawBody) as { id?: number; status?: string; [key: string]: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const status = payload.status

  if (status === "active") {
    // Discount activated: optionally update product compare-at prices via Admin API
    // Example: get discount's target collections, fetch variants, set compareAtPrice = current price, price = discounted price
  }

  if (status === "expired" || status === "disabled") {
    // Discount deactivated: optionally reset compareAtPrice on affected variants
  }

  return NextResponse.json({ received: true })
}
