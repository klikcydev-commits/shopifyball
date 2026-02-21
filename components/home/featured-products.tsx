"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/products/product-card"
import { SectionHeader } from "@/components/ui/section-header"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { getFeaturedProductsAction } from "@/app/actions/product-actions"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import type { Product } from "@/lib/shopify-types"

const FEATURED_COUNT = 6

export function FeaturedProducts() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await getFeaturedProductsAction()
        const adaptedProducts = result.products.map(adaptShopifyProduct)
        setProducts(adaptedProducts)
      } catch (error) {
        console.error('Error loading featured products:', error)
      }
    }
    loadProducts()
  }, [])

  return (
    <section ref={ref} className="py-20 md:py-32 bg-secondary/50" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mb-12 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <SectionHeader
            eyebrow="Featured"
            title="Premium Picks"
            subtitle="Handpicked accessories for the discerning football lifestyle."
            align="left"
            className="mb-0"
          />
        </div>

        {/* Products Grid */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: isRevealed ? "200ms" : "0ms" }}
        >
          {products.length === 0 ? (
            // Loading skeletons (6 = 2 per collection × 3 collections)
            Array.from({ length: FEATURED_COUNT }).map((_, index) => (
              <div key={index} className="aspect-square bg-secondary rounded-lg animate-pulse" />
            ))
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
