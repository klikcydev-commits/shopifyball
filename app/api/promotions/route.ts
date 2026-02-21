import { NextResponse } from "next/server"
import { getPromotions } from "@/lib/promotions"

/**
 * GET /api/promotions
 * Fetches active offers from Shopify Discounts (e.g. free shipping, percentage off, BXGY).
 * Only returns discounts that are currently active. Cached 120s; use revalidateTag("promotions") to invalidate.
 */
export async function GET() {
  const data = await getPromotions()
  return NextResponse.json(data)
}
