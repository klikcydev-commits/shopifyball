import { buildProductsSitemapXml } from "@/lib/seo/sitemaps"

export const dynamic = "force-dynamic"

export async function GET() {
  const xml = await buildProductsSitemapXml()
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
