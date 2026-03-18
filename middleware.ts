import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Security hardening for scanners/antivirus extensions:
 * Some tools flag Next.js URLs that include `?_rsc=...` or `?rs=...` as "suspicious",
 * even though `_rsc` is a normal Next.js App Router mechanism.
 *
 * We only redirect when the browser is requesting real HTML navigation
 * (Accept includes `text/html`) to avoid interfering with Next.js internal RSC fetches.
 */
export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const pathname = nextUrl.pathname

  const isBlogIndex = pathname === "/blog"
  const isBlogPost = pathname.startsWith("/blog/") && pathname.split("/").length >= 3
  if (!isBlogIndex && !isBlogPost) return NextResponse.next()

  const hasSuspiciousParams = nextUrl.searchParams.has("_rsc") || nextUrl.searchParams.has("rs")
  if (!hasSuspiciousParams) return NextResponse.next()

  const accept = request.headers.get("accept") ?? ""
  const wantsHtml = accept.includes("text/html")
  if (!wantsHtml) return NextResponse.next()

  // Redirect to canonical clean URL (remove query string entirely).
  const cleanUrl = nextUrl.clone()
  cleanUrl.search = ""
  return NextResponse.redirect(cleanUrl)
}

export const config = {
  matcher: ["/blog", "/blog/:path*"],
}

