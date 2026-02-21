/**
 * Central SEO keyword map (geo variants). Use in metadata only — not in visible body copy.
 * Source: content/seo/seo-map.json (schema: pages, collections, products)
 */

import seoMapData from "@/content/seo/seo-map.json"

const data = seoMapData as {
  pages?: Record<string, { focusKeyword?: string; secondaryKeywords?: string[] }>
  collections?: Record<string, { focusKeyword?: string; secondaryKeywords?: string[] }>
  products?: { descriptionSuffix?: string; titleTemplate?: string; secondaryKeywordTemplate?: string[] }
}

export interface PageKeywords {
  focusKeyword: string
  secondaryKeywords: string[]
}

const routeToPage: Record<string, string> = { "/": "/", "/shop": "/shop", "/about": "/about" }

export function getSeoKeywords(page: "home" | "shop" | "about"): PageKeywords | null {
  const route = page === "home" ? "/" : `/${page}`
  const entry = data.pages?.[route]
  if (!entry?.focusKeyword) return null
  return {
    focusKeyword: entry.focusKeyword ?? "",
    secondaryKeywords: Array.isArray(entry.secondaryKeywords) ? entry.secondaryKeywords : [],
  }
}

export function getCollectionSeoKeywords(handle: string): PageKeywords | null {
  const entry = data.collections?.[handle]
  if (!entry?.focusKeyword) return null
  return {
    focusKeyword: entry.focusKeyword,
    secondaryKeywords: Array.isArray(entry.secondaryKeywords) ? entry.secondaryKeywords : [],
  }
}

/** Keywords for meta only (e.g. default layout). Combines home + shop geo variants. */
export function getDefaultMetaKeywords(): string[] {
  const home = data.pages?.["/"]
  const shop = data.pages?.["/shop"]
  const combined = [
    ...(home?.focusKeyword ? [home.focusKeyword, ...(home.secondaryKeywords ?? [])] : []),
    ...(shop?.secondaryKeywords ?? []).filter((k) => !(home?.secondaryKeywords ?? []).includes(k)),
  ]
  return [...new Set(combined)].slice(0, 12)
}

export const productDescriptionSuffix =
  data.products?.descriptionSuffix ?? "UAE delivery—Dubai, Abu Dhabi, Sharjah & more."
