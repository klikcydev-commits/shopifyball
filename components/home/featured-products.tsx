"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/products/product-card"
import { SectionHeader } from "@/components/ui/section-header"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { getProductsAction } from "@/app/actions/product-actions"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import type { Product } from "@/lib/shopify-types"

export function FeaturedProducts() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await getProductsAction({ first: 8 })
        const adaptedProducts = result.products.map(adaptShopifyProduct)
        setProducts(adaptedProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }
    loadProducts()
  }, [])

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section ref={ref} className="py-20 md:py-32 bg-secondary/50" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6 transition-all duration-700",
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

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "p-3 border border-border rounded-lg transition-colors",
                canScrollLeft ? "hover:bg-secondary hover:border-gold" : "opacity-40 cursor-not-allowed",
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "p-3 border border-border rounded-lg transition-colors",
                canScrollRight ? "hover:bg-secondary hover:border-gold" : "opacity-40 cursor-not-allowed",
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Products carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={cn(
            "flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: isRevealed ? "200ms" : "0ms" }}
        >
          {products.length === 0 ? (
            <div className="flex-shrink-0 w-[280px] md:w-[320px] snap-start">
              <div className="aspect-square bg-secondary rounded-lg animate-pulse" />
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
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
