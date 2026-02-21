/**
 * Helpers for generating categorized sitemaps. Used by route handlers.
 */

import { getCollections, getAllProducts } from "@/lib/shopify"
import { getSitemapBaseUrl, isNoIndexRoute } from "./build-metadata"
import fs from "fs"
import { join } from "path"
import matter from "gray-matter"

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>'
const SITEMAP_NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function formatLastMod(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Build absolute URL for sitemaps: base has no trailing slash, path must start with /. No double slashes. */
function sitemapUrl(base: string, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

/** Sitemap index listing child sitemaps. */
export function buildSitemapIndexXml(): string {
  const base = getSitemapBaseUrl()
  const lastmod = formatLastMod(new Date())
  const sitemaps = [
    "sitemap-pages.xml",
    "sitemap-collections.xml",
    "sitemap-products.xml",
    "sitemap-blogs.xml",
  ]
  const entries = sitemaps
    .map(
      (path) =>
        `  <sitemap>\n    <loc>${escapeXml(sitemapUrl(base, `/${path}`))}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`
    )
    .join("\n")
  return `${XML_HEADER}\n<sitemapindex ${SITEMAP_NS}>\n${entries}\n</sitemapindex>`
}

/** Static pages only (exclude noindex e.g. /11kit). */
export function buildPagesSitemapXml(): string {
  const base = getSitemapBaseUrl()
  const lastmod = formatLastMod(new Date())
  const routes = ["", "/shop", "/about", "/contact", "/blog", "/search", "/products"]
  const entries = routes
    .filter((route) => !isNoIndexRoute(route || "/"))
    .map((route) => {
      const path = route === "" ? "/" : route
      const loc = sitemapUrl(base, path)
      const priority = route === "" ? "1.0" : "0.8"
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    })
    .join("\n")
  return `${XML_HEADER}\n<urlset ${SITEMAP_NS}>\n${entries}\n</urlset>`
}

/** Collections: /search?collection={handle} */
export async function buildCollectionsSitemapXml(): Promise<string> {
  const base = getSitemapBaseUrl()
  const lastmod = formatLastMod(new Date())
  let collections: { handle: string }[] = []
  try {
    collections = await getCollections(50)
  } catch {
    // fallback empty
  }
  const entries = collections.map(
    (c) =>
      `  <url>\n    <loc>${escapeXml(sitemapUrl(base, `/search?collection=${encodeURIComponent(c.handle)}`))}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  ).join("\n")
  return `${XML_HEADER}\n<urlset ${SITEMAP_NS}>\n${entries}\n</urlset>`
}

/** Products: /products/{handle}. Paginates via getAllProducts. Logs errors for debugging in production. */
export async function buildProductsSitemapXml(): Promise<string> {
  const base = getSitemapBaseUrl()
  const lastmod = formatLastMod(new Date())
  let products: { handle: string }[] = []
  try {
    products = await getAllProducts()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const code = err instanceof Error ? (err as Error & { code?: string }).code : undefined
    console.error("[sitemap-products] Shopify fetch failed:", msg, code ? `(code: ${code})` : "")
    if (code === "MISSING_ENV_VARS") {
      console.error("[sitemap-products] Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in Vercel Production env.")
    }
  }
  const entries = products.map(
    (p) =>
      `  <url>\n    <loc>${escapeXml(sitemapUrl(base, `/products/${encodeURIComponent(p.handle)}`))}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
  ).join("\n")
  return `${XML_HEADER}\n<urlset ${SITEMAP_NS}>\n${entries}\n</urlset>`
}

/** Blog posts: slugs from content/blog and content/blog/posts. */
export function getAllBlogSlugs(): { slug: string; lastmod: string }[] {
  const results: { slug: string; lastmod: string }[] = []
  const blogDir = join(process.cwd(), "content/blog")
  const postsDir = join(blogDir, "posts")
  const readDir = (dir: string) => {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)
    for (const file of files) {
      if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue
      const filePath = join(dir, file)
      const slug = file.replace(/\.(mdx|md)$/, "")
      let date = new Date().toISOString().slice(0, 10)
      try {
        const content = fs.readFileSync(filePath, "utf8")
        const { data } = matter(content)
        if (data.date) date = new Date(data.date).toISOString().slice(0, 10)
      } catch {
        // keep build date
      }
      results.push({ slug, lastmod: date })
    }
  }
  readDir(postsDir)
  readDir(blogDir)
  const seen = new Set<string>()
  return results.filter((r) => {
    if (seen.has(r.slug)) return false
    seen.add(r.slug)
    return true
  })
}

export function buildBlogsSitemapXml(): string {
  const base = getSitemapBaseUrl()
  const slugs = getAllBlogSlugs()
  const entries = slugs
    .map(
      (r) =>
        `  <url>\n    <loc>${escapeXml(sitemapUrl(base, `/blog/${encodeURIComponent(r.slug)}`))}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    )
    .join("\n")
  return `${XML_HEADER}\n<urlset ${SITEMAP_NS}>\n${entries}\n</urlset>`
}
