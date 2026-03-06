/**
 * llms.txt content builder for AI/LLM crawlers.
 * Spec: https://llmstxt.org — H1 brand, blockquote summary, H2 sections, bullet links [Title](URL): Description.
 * UTF-8, plain text. Only include indexable pages (exclude noindex).
 */

import { getBaseUrl } from "./build-metadata"
import seoMapData from "@/content/seo/seo-map.json"

const data = seoMapData as {
  baseUrl?: string
  pages?: Record<
    string,
    { title?: string; description?: string; robots?: string }
  >
  collections?: Record<
    string,
    { title?: string; description?: string }
  >
}

function fullUrl(path: string): string {
  const base = getBaseUrl()
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

/** Returns true if the route is indexable (not noindex). */
function isIndexable(route: string): boolean {
  const entry = data.pages?.[route === "" ? "/" : route.startsWith("/") ? route : `/${route}`]
  return entry?.robots !== "noindex,follow"
}

/** Build llms.txt body: Markdown with H1, blockquote, H2 sections, bullet links. */
export function buildLlmsTxt(): string {
  const base = getBaseUrl()
  const lines: string[] = []

  // H1 — brand/site name
  lines.push("# Lemah")
  lines.push("")

  // Blockquote — one-line summary (required by spec)
  lines.push("> Premium football accessories and collectible frames. UAE delivery — Dubai, Abu Dhabi, Sharjah & more. Gift-ready packaging.")
  lines.push("")

  // Main pages (indexable only)
  lines.push("## Main")
  const mainRoutes = [
    { path: "/", title: "Home", description: "Football accessories & gifts UAE. Collectible frames, wall art, Ronaldo and Messi gifts." },
    { path: "/shop", title: "Shop", description: "Browse football gifts, accessories, and wall art. UAE delivery." },
    { path: "/search", title: "Search", description: "Search football gifts, accessories, and collectibles." },
    { path: "/products", title: "Products", description: "Full product list. Premium football gear, UAE delivery." },
  ]
  for (const { path, title, description } of mainRoutes) {
    if (path === "/" || isIndexable(path)) {
      lines.push(`- [${title}](${fullUrl(path)}): ${description}`)
    }
  }
  lines.push("")

  // Collections (curated category pages)
  lines.push("## Collections")
  const collections = data.collections ?? {}
  const collectionOrder = ["cr7", "mbappe", "legends"]
  for (const handle of collectionOrder) {
    const c = collections[handle]
    if (!c?.title) continue
    const url = fullUrl(`/search?collection=${encodeURIComponent(handle)}`)
    const desc = c.description?.slice(0, 120) ?? c.title
    lines.push(`- [${c.title}](${url}): ${desc}`)
  }
  // Any other collections from seo-map not in order
  for (const [handle, c] of Object.entries(collections)) {
    if (collectionOrder.includes(handle) || !c?.title) continue
    const url = fullUrl(`/search?collection=${encodeURIComponent(handle)}`)
    const desc = (c as { description?: string }).description?.slice(0, 120) ?? c.title
    lines.push(`- [${c.title}](${url}): ${desc}`)
  }
  lines.push("")

  // Content & company
  lines.push("## Content & company")
  const contentRoutes = [
    { path: "/blog", title: "Blog", description: "Guides and articles on football gifts and where to buy in Dubai and the UAE." },
    { path: "/about", title: "About", description: "About Lemah. Collectible football frames and gifts Dubai UAE." },
    { path: "/contact", title: "Contact", description: "Contact Lemah. Football shop UAE, Dubai, Abu Dhabi, Sharjah." },
  ]
  for (const { path, title, description } of contentRoutes) {
    if (isIndexable(path)) {
      lines.push(`- [${title}](${fullUrl(path)}): ${description}`)
    }
  }
  lines.push("")

  // For LLMs — sitemap and contact
  lines.push("## For LLMs")
  lines.push(`- Sitemap: ${base}/sitemap.xml`)
  lines.push(`- Contact: ${base}/contact`)
  lines.push("")

  return lines.join("\n").trimEnd()
}
