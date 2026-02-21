import { buildProductsSitemapXml } from "@/lib/seo/sitemaps"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const xml = await buildProductsSitemapXml()
    const urlCount = (xml.match(/<url>/g) ?? []).length
    if (urlCount === 0) {
      console.warn("[sitemap-products] Generated with 0 URLs. Check Vercel logs for Shopify errors or set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.")
    }
    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (err) {
    console.error("[sitemap-products] Route error:", err instanceof Error ? err.message : err)
    const fallback = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
    return new Response(fallback, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    })
  }
}
