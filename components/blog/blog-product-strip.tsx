"use client"

import Link from "next/link"
import type { ShopifyProduct } from "@/lib/shopify/types"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import { ProductCard } from "@/components/products/product-card"

interface BlogProductStripProps {
  products: ShopifyProduct[]
  title?: string
}

export function BlogProductStrip({ products, title = "Shop related" }: BlogProductStripProps) {
  const adapted = products
    .slice(0, 4)
    .map((p) => {
      try {
        return adaptShopifyProduct(p)
      } catch {
        return null
      }
    })
    .filter(Boolean) as Awaited<ReturnType<typeof adaptShopifyProduct>>[]

  if (adapted.length === 0) return null

  return (
    <section className="mb-12 rounded-xl border border-border bg-muted/30 p-6" aria-label="Related products">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adapted.map((product) => (
          <ProductCard key={product.id} product={product} size="default" />
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        <Link href="/shop" className="font-medium text-foreground underline underline-offset-2 hover:text-gold">
          View all products →
        </Link>
      </p>
    </section>
  )
}
