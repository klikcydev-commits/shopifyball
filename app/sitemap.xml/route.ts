import { buildSitemapIndexXml } from "@/lib/seo/sitemaps"

export const dynamic = "force-dynamic"

export async function GET() {
  const xml = buildSitemapIndexXml()
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
