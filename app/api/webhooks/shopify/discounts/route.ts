import { createHmac, timingSafeEqual } from "crypto"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

/**
 * Verify Shopify webhook signature using HMAC-SHA256.
 * Body must be the raw request body; secret = SHOPIFY_WEBHOOK_SECRET.
 */
function verifyShopifyHmac(body: string, hmacHeader: string, secret: string): boolean {
  if (!secret) return false
  const computed = createHmac("sha256", secret).update(body, "utf8").digest("base64")
  try {
    const a = Buffer.from(computed, "utf8")
    const b = Buffer.from(hmacHeader, "utf8")
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/**
 * Shopify webhook: discount create / update / delete.
 * Configure in Shopify Admin: Settings → Notifications → Webhooks:
 *   - Event: Discount creation, Discount update, Discount deletion
 *   - URL: https://your-domain.com/api/webhooks/shopify/discounts
 *
 * ENV: SHOPIFY_WEBHOOK_SECRET (webhook signing secret from Shopify).
 * On receive we purge promo cache so the storefront shows/hides discounts automatically.
 */
export async function POST(request: Request) {
  const hmac = request.headers.get("x-shopify-hmac-sha256")
  if (!hmac) {
    return NextResponse.json({ error: "Missing HMAC" }, { status: 401 })
  }

  const rawBody = await request.text()
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) {
    console.error("[webhooks/discounts] SHOPIFY_WEBHOOK_SECRET not set")
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 })
  }

  if (!verifyShopifyHmac(rawBody, hmac, secret)) {
    return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 })
  }

  let payload: { id?: number; status?: string; [key: string]: unknown }
  try {
    payload = JSON.parse(rawBody) as { id?: number; status?: string; [key: string]: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Purge promotions cache so next request refetches active discounts (Next.js 16: revalidateTag requires 2 args)
  revalidateTag("promotions", "max")
  revalidatePath("/")

  return NextResponse.json({ received: true })
}
