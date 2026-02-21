/**
 * Build Next.js Metadata from content/seo/seo-map.json.
 * Use for static pages; products/blog use generateMetadata with their own data.
 */

import type { Metadata } from "next"
import seoMapData from "@/content/seo/seo-map.json"

const data = seoMapData as {
  baseUrl?: string
  pages?: Record<
    string,
    {
      route?: string
      focusKeyword?: string
      secondaryKeywords?: string[]
      title?: string
      description?: string
      ogImage?: string
      robots?: string
    }
  >
  collections?: Record<
    string,
    { focusKeyword?: string; secondaryKeywords?: string[]; title?: string; description?: string }
  >
  products?: { descriptionSuffix?: string; titleTemplate?: string; secondaryKeywordTemplate?: string[] }
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || data.baseUrl || "https://lemah.store"
}

function getPageEntry(route: string) {
  const pages = data.pages ?? {}
  const normalized = route === "" ? "/" : route.startsWith("/") ? route : `/${route}`
  return pages[normalized] ?? null
}

export function getPageMetadata(route: string): Metadata {
  const baseUrl = getBaseUrl()
  const entry = getPageEntry(route)
  if (!entry) {
    return {}
  }
  const canonical = `${baseUrl}${entry.route === "/" ? "" : entry.route}`
  const title = entry.title ?? ""
  const description = entry.description ?? ""
  const ogImage = entry.ogImage
    ? (entry.ogImage.startsWith("http") ? entry.ogImage : `${baseUrl}${entry.ogImage}`)
    : undefined
  const keywords = [
    ...(entry.focusKeyword ? [entry.focusKeyword] : []),
    ...(Array.isArray(entry.secondaryKeywords) ? entry.secondaryKeywords : []),
  ].filter(Boolean) as string[]

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    robots: entry.robots ?? "index,follow",
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
  return metadata
}

export function getCollectionMetadata(handle: string): Metadata | null {
  const baseUrl = getBaseUrl()
  const collections = data.collections ?? {}
  const entry = collections[handle]
  if (!entry?.title) return null
  const url = `${baseUrl}/search?collection=${handle}`
  const title = entry.title ?? ""
  const description = entry.description ?? ""
  const keywords = [
    ...(entry.focusKeyword ? [entry.focusKeyword] : []),
    ...(Array.isArray(entry.secondaryKeywords) ? entry.secondaryKeywords : []),
  ].filter(Boolean) as string[]

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

/** Whether this route is noindex (exclude from sitemaps). */
export function isNoIndexRoute(route: string): boolean {
  const entry = getPageEntry(route)
  return entry?.robots === "noindex,follow"
}

/** Product metadata helpers (used in products/[handle]/page.tsx). */
export function getProductDescriptionSuffix(): string {
  return (data.products as { descriptionSuffix?: string } | undefined)?.descriptionSuffix ?? "UAE delivery—Dubai, Abu Dhabi, Sharjah & more."
}

export function getProductTitleTemplate(): string {
  return (data.products as { titleTemplate?: string } | undefined)?.titleTemplate ?? "{productTitle} | Football Gifts Dubai & UAE | Lemah"
}
