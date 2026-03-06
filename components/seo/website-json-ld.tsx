/**
 * WebSite JSON-LD for site-wide crawler context. Rendered in layout.
 */

import {
  buildWebSiteStructuredData,
  toJsonLdScript,
} from "@/lib/seo/structured-data"

export function WebsiteJsonLd() {
  const data = buildWebSiteStructuredData()
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLdScript(data) }}
    />
  )
}
