"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Check } from "lucide-react"
import type { Product } from "@/lib/shopify-types"
import { useCart } from "@/components/cart/cart-context"
import { useToast } from "@/hooks/use-toast"
import { ProductTile } from "@/components/products/product-tile"

const materials = [
  { name: "Solid Frame Build", detail: "Sturdy, built to last on your wall" },
  { name: "Quality Glass & Mounts", detail: "Clear, protective, display-ready" },
  { name: "Soft-Touch Finishes", detail: "Matte textures that feel right" },
  { name: "Reinforced Corners", detail: "Built for the long run" },
  { name: "Gold Accents", detail: "Signature detail where it matters" },
  { name: "Gift-Ready Packaging", detail: "Safe arrival across Dubai & UAE" },
]

/** Pick n random items from array (with replacement if pool is smaller than n). */
function pickRandomN<T>(arr: T[], n: number): T[] {
  if (arr.length === 0) return []
  return Array.from({ length: n }, () => arr[Math.floor(Math.random() * arr.length)])
}

interface MaterialsCraftProps {
  products?: Product[]
}

export function MaterialsCraft({ products = [] }: MaterialsCraftProps) {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [fourProducts, setFourProducts] = useState<Product[]>([])
  const [addingId, setAddingId] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const productPool = useMemo(() => (products.length > 0 ? products : []), [products])

  // Pick 4 random products once on mount
  useEffect(() => {
    if (productPool.length === 0) return
    setFourProducts(pickRandomN(productPool, 4))
  }, [productPool])

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.variants?.length) {
      toast({ title: "Error", description: "No variants available.", variant: "destructive" })
      return
    }
    const variant = product.variants.find((v) => v.availableForSale) ?? product.variants[0]
    if (!variant?.availableForSale) {
      toast({ title: "Out of stock", description: "This product is unavailable.", variant: "destructive" })
      return
    }
    setAddingId(product.id)
    try {
      await addToCart(product, variant)
      toast({ title: "Added to cart", description: product.title })
    } catch {
      toast({ title: "Error", description: "Failed to add to cart.", variant: "destructive" })
    } finally {
      setAddingId(null)
    }
  }

  const showProducts = productPool.length > 0 && fourProducts.length === 4

  return (
    <section ref={ref} className="py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div
            className={cn(
              "transition-all duration-700",
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Materials & Craft</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              What goes in.
              <br />
              <span className="text-gold">What comes out.</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-10">
              We choose materials you see and feel. Every collectible frame we make is built for display, durability, and that premium touch. No fill.
            </p>

            {/* Materials list */}
            <div className="grid sm:grid-cols-2 gap-4">
              {materials.map((material, index) => (
                <div
                  key={material.name}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg bg-white/5 transition-all duration-500",
                    isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  )}
                  style={{ transitionDelay: isRevealed ? `${index * 75}ms` : "0ms" }}
                >
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{material.name}</p>
                    <p className="text-xs text-primary-foreground/50">{material.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 product tiles (random from collection, rotate every 10s) or static grid */}
          <div
            className={cn(
              "transition-all duration-700",
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12",
            )}
            style={{ transitionDelay: "200ms" }}
          >
            {showProducts ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <ProductTile
                    product={fourProducts[0]}
                    aspect="square"
                    variant="dark"
                    onAddToCart={handleAddToCart}
                    isAdding={addingId === fourProducts[0]?.id}
                  />
                  <ProductTile
                    product={fourProducts[1]}
                    aspect="4/3"
                    variant="dark"
                    onAddToCart={handleAddToCart}
                    isAdding={addingId === fourProducts[1]?.id}
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <ProductTile
                    product={fourProducts[2]}
                    aspect="4/3"
                    variant="dark"
                    onAddToCart={handleAddToCart}
                    isAdding={addingId === fourProducts[2]?.id}
                  />
                  <ProductTile
                    product={fourProducts[3]}
                    aspect="square"
                    variant="dark"
                    onAddToCart={handleAddToCart}
                    isAdding={addingId === fourProducts[3]?.id}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-gold/20 to-transparent p-6 flex items-end">
                    <p className="text-xs uppercase tracking-wider text-gold">Frame Build</p>
                  </div>
                  <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-white/10 to-transparent p-6 flex items-end">
                    <p className="text-xs uppercase tracking-wider text-primary-foreground/60">Gold Details</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-white/5 to-transparent p-6 flex items-end">
                    <p className="text-xs uppercase tracking-wider text-primary-foreground/60">Soft Touch</p>
                  </div>
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-gold/10 to-transparent p-6 flex items-end">
                    <p className="text-xs uppercase tracking-wider text-gold/80">Gift Ready</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
