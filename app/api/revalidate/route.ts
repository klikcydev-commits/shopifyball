import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

/**
 * POST /api/revalidate?secret=...
 * Invalidates cached active discounts so the next request refetches from Shopify.
 * Call from Shopify flow (e.g. discount webhook) or manually.
 * Set REVALIDATE_SECRET in env and pass as query param or header x-revalidate-secret.
 */
export async function POST(request: Request) {
  const url = new URL(request.url)
  const querySecret = url.searchParams.get("secret")
  const headerSecret = request.headers.get("x-revalidate-secret")
  const secret = querySecret ?? headerSecret

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  revalidateTag("discounts")
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
