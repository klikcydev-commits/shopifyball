import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js 16+ security hardening for scanners/antivirus extensions.
 *
 * Some tools flag Next.js URLs that include `?_rsc=...` or `?rs=...` as suspicious,
 * even though `_rsc` is a normal Next.js App Router mechanism.
 *
 * Strategy:
 * - Keep internal App Router RSC fetches untouched.
 * - Redirect all other blog requests containing these params to the clean canonical URL.
 */
export function proxy(request: NextRequest) {
  const { nextUrl } = request
  const pathname = nextUrl.pathname

  const isBlogIndex = pathname === "/blog"
  const isBlogPost =
    pathname.startsWith("/blog/") && pathname.split("/").length >= 3
  if (!isBlogIndex && !isBlogPost) return NextResponse.next()

  const hasSuspiciousParams =
    nextUrl.searchParams.has("_rsc") || nextUrl.searchParams.has("rs")
  if (!hasSuspiciousParams) return NextResponse.next()

  // Let internal App Router payload requests pass through.
  const isInternalRscRequest =
    request.headers.get("rsc") === "1" ||
    request.headers.has("next-router-prefetch")
  if (isInternalRscRequest) return NextResponse.next()

  // Redirect to canonical clean URL (remove query string entirely).
  const cleanUrl = nextUrl.clone()
  cleanUrl.search = ""
  return NextResponse.redirect(cleanUrl)
}

export const config = {
  matcher: ["/blog", "/blog/:path*"],
}

