import { NextResponse } from "next/server"
import { getPromotions } from "@/lib/promotions"

/**
 * GET /api/promotions
 * Returns active Shopify discounts (deals, free shipping, BXGY) for the storefront.
 * Server-only data source; cached 120s. Use SHOPIFY_WEBHOOK_SECRET + webhook to revalidate on discount changes.
 */
export async function GET() {
  const data = await getPromotions()
  return NextResponse.json(data)
}
