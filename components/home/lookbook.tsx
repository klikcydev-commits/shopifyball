"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { SectionHeader } from "@/components/ui/section-header"
import { getLookbookProductsAction } from "@/app/actions/product-actions"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import type { ShopifyProduct } from "@/lib/shopify/types"
import { useCart } from "@/components/cart/cart-context"
import { useToast } from "@/hooks/use-toast"

export function Lookbook() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    getLookbookProductsAction()
      .then((res) => {
        setProducts(res.products || [])
        setSelectedId(null)
      })
      .catch(() => setProducts([]))
  }, [])

  const handleAddToCart = async (e: React.MouseEvent, shopifyProduct: ShopifyProduct) => {
    e.preventDefault()
    e.stopPropagation()
    const product = adaptShopifyProduct(shopifyProduct)
    const variant = product.variants?.[0]
    if (!variant) {
      toast({ title: "Error", description: "No variant available.", variant: "destructive" })
      return
    }
    if (!variant.availableForSale) {
      toast({ title: "Out of stock", description: "This product is unavailable.", variant: "destructive" })
      return
    }
    setIsAdding(product.id)
    try {
      await addToCart(product, variant)
      toast({ title: "Added to cart", description: product.title })
    } catch {
      toast({ title: "Error", description: "Failed to add to cart.", variant: "destructive" })
    } finally {
      setIsAdding(null)
    }
  }

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <SectionHeader
            eyebrow="Lookbook"
            title="Moments"
            subtitle="Where the game lives in every scene — and every detail."
          />
        </div>

        {products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-lg bg-muted animate-pulse",
                  i % 3 === 0 && "md:row-span-2 md:aspect-[3/4]",
                )}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product, index) => {
              const imageUrl =
                product.images?.edges?.[0]?.node?.url || "/placeholder.svg"
              const alt = product.images?.edges?.[0]?.node?.altText || product.title
              const isSelected = selectedId === product.id
              const showOverlay = isSelected

              return (
                <div
                  key={product.id}
                  className={cn(
                    "group relative overflow-hidden rounded-lg transition-all duration-700",
                    index % 3 === 0 ? "md:row-span-2 md:aspect-[3/4]" : "aspect-square",
                    isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                  )}
                  style={{ transitionDelay: isRevealed ? `${index * 75}ms` : "0ms" }}
                  onMouseEnter={() => setSelectedId(product.id)}
                  onMouseLeave={() => setSelectedId(null)}
                  onClick={() => setSelectedId((prev) => (prev === product.id ? null : product.id))}
                >
                  <Image
                    src={imageUrl}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />

                  {/* Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300",
                      showOverlay ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                  />

                  {/* Caption */}
                  <div
                    className={cn(
                      "absolute bottom-4 left-4 right-4 transition-all duration-300",
                      showOverlay ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                    )}
                  >
                    <p className="text-white text-sm font-medium mb-3">{product.title}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!!isAdding}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-gold text-primary text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors disabled:opacity-60"
                      >
                        {isAdding === product.id ? (
                          <span className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShoppingBag className="h-3.5 w-3.5" />
                        )}
                        Add to cart
                      </button>
                      <Link
                        href={`/products/${product.handle}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white/20 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/30 transition-colors border border-white/30"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View product
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
