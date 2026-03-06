/**
 * Product + Breadcrumb JSON-LD for product pages. Renders in head/body for crawlers.
 */

import type { ShopifyProduct } from "@/lib/shopify/types"
import {
  buildProductStructuredData,
  buildBreadcrumbStructuredData,
  toJsonLdScript,
} from "@/lib/seo/structured-data"
import { getBaseUrl } from "@/lib/seo/build-metadata"

interface ProductJsonLdProps {
  product: ShopifyProduct
  handle: string
}

export function ProductJsonLd({ product, handle }: ProductJsonLdProps) {
  const baseUrl = getBaseUrl()
  const productUrl = `${baseUrl}/products/${encodeURIComponent(handle)}`

  const productData = buildProductStructuredData(product, handle)
  const breadcrumbData = buildBreadcrumbStructuredData([
    { name: "Home", url: baseUrl },
    { name: "Shop", url: `${baseUrl}/shop` },
    { name: product.title, url: productUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(productData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(breadcrumbData) }}
      />
    </>
  )
}
