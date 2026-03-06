/**
 * Schema.org JSON-LD for LLM and search crawlers.
 * Clean, valid structured data so every page and product is easily crawlable.
 */

import type { ShopifyProduct } from "@/lib/shopify/types"
import { getBaseUrl } from "./build-metadata"

/** Strip HTML and normalize whitespace for crawler-friendly text. */
export function stripHtmlToText(html: string): string {
  if (!html || typeof html !== "string") return ""
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Build Product schema for a Shopify product. */
export function buildProductStructuredData(
  product: ShopifyProduct,
  handle: string
): Record<string, unknown> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/products/${encodeURIComponent(handle)}`
  const firstVariant = product.variants?.edges?.[0]?.node ?? product.variants?.nodes?.[0]
  const price = firstVariant?.price?.amount ?? product.priceRange?.minVariantPrice?.amount ?? "0"
  const currency =
    firstVariant?.price?.currencyCode ??
    product.priceRange?.minVariantPrice?.currencyCode ??
    "AED"
  const available = firstVariant?.availableForSale ?? true
  const imageUrl = product.images?.edges?.[0]?.node?.url

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: stripHtmlToText(product.descriptionHtml || product.description || "").slice(
      0,
      5000
    ),
    url,
    image: imageUrl ? [imageUrl] : undefined,
    sku: firstVariant?.id ?? product.id,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price: parseFloat(price).toFixed(2),
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Lemah",
      },
    },
    brand: {
      "@type": "Brand",
      name: "Lemah",
    },
  }
}

/** Build BreadcrumbList for a product page. */
export function buildBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** WebSite + Organization for site-wide context (layout). */
export function buildWebSiteStructuredData(): Record<string, unknown> {
  const baseUrl = getBaseUrl()
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lemah",
    url: baseUrl,
    description:
      "Premium football accessories and collectible frames. UAE delivery—Dubai, Abu Dhabi, Sharjah & more. Gift-ready packaging.",
    publisher: {
      "@type": "Organization",
      name: "Lemah",
      url: baseUrl,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/** Safe JSON stringify for script tag (no XSS). */
export function toJsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data)
}
