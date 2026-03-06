"use client"

import { useState, useEffect } from "react"
import { SectionHeader } from "@/components/ui/section-header"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { getRandomPoolProductsAction } from "@/app/actions/product-actions"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import type { Product } from "@/lib/shopify-types"
import { ProductCard } from "@/components/products/product-card"
import { cn } from "@/lib/utils"

const DISPLAY_COUNT = 6
/** "X people bought" — random variety e.g. 7, 33, 41, 49 (inclusive). */
const PEOPLE_BOUGHT_MIN = 7
const PEOPLE_BOUGHT_MAX = 51

/** Fisher–Yates shuffle (client-side so each session gets different order). */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Deterministic "X people bought" from product id so the same product always shows the same number. */
function peopleBoughtForProduct(productId: string, min: number, max: number): number {
  let h = 0
  for (let i = 0; i < productId.length; i++) {
    h = (h * 31 + productId.charCodeAt(i)) >>> 0
  }
  const range = max - min + 1
  return min + (Math.abs(h) % range)
}

interface ProductWithSocialProof {
  product: Product
  peopleBought: number
}

export function RandomProductsSection() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [items, setItems] = useState<ProductWithSocialProof[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { products: pool } = await getRandomPoolProductsAction()
        if (cancelled) return
        const adapted = pool.map(adaptShopifyProduct)
        const picked = adapted.length <= DISPLAY_COUNT
          ? shuffle(adapted)
          : shuffle(adapted).slice(0, DISPLAY_COUNT)
        setItems(
          picked.map((product) => ({
            product,
            peopleBought: peopleBoughtForProduct(product.id, PEOPLE_BOUGHT_MIN, PEOPLE_BOUGHT_MAX),
          }))
        )
      } catch (err) {
        if (!cancelled) console.error("Random products section:", err)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background" id="random-picks">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mb-12 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <SectionHeader
            eyebrow="Discover"
            title="Best Selling"
            align="center"
          />
        </div>

        <div
          className={cn(
            "flex flex-wrap justify-center gap-3 md:gap-5 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: isRevealed ? "200ms" : "0ms" }}
        >
          {items.length === 0 ? (
            Array.from({ length: DISPLAY_COUNT }).map((_, i) => (
              <div
                key={i}
                className="w-[170px] sm:w-[220px] md:w-[260px] rounded-xl overflow-hidden bg-muted animate-pulse"
              >
                <div className="aspect-[3/4] bg-muted/80" />
                <div className="h-24 bg-muted/60" />
              </div>
            ))
          ) : (
            items.map(({ product, peopleBought }, i) => (
              <div
                key={product.id}
                className="flex flex-col items-center"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <ProductCard product={product} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {peopleBought} people bought
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
