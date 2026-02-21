"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Eye, Star } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
import { cn, formatPriceWithCurrency } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { getFeaturedProductsAction } from "@/app/actions/product-actions"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import { getCardPricing } from "@/lib/sale-helpers"
import type { Product } from "@/lib/shopify-types"
import { useCart } from "@/components/cart/cart-context"
import { useToast } from "@/hooks/use-toast"

const FEATURED_COUNT = 6

function FeaturedProductCard({
  product,
  onAddToCart,
  isAdding,
}: {
  product: Product
  onAddToCart: (e: React.MouseEvent, product: Product) => void
  isAdding: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const imageUrl = product.images?.[0]?.url || "/placeholder.svg"
  const variantOption = product.variants?.find((v) => v.availableForSale) ?? product.variants?.[0]
  const pricing = getCardPricing(
    variantOption
      ? {
          price: variantOption.price,
          compareAtPrice: variantOption.compareAtPrice ?? undefined,
          currencyCode: variantOption.currencyCode ?? product.currencyCode ?? "AED",
        }
      : null
  )
  const onSale = pricing.isSale
  const isAvailable = product.availableForSale && product.variants?.some((v) => v.availableForSale)

  return (
    <div
      className="group relative w-full overflow-hidden rounded-lg bg-muted"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image + overlay (ProductTile style) */}
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={product.title || "Product"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {onSale && (
          <span className="absolute top-2 left-2 z-10 rounded-md bg-red-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white shadow">
            Sale
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
          <Link href={`/products/${product.handle}`} onClick={(e) => e.stopPropagation()} className="block">
            <p className="font-medium text-sm truncate text-white">{product.title}</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              {onSale ? (
                <>
                  <span className="inline-block rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm text-sm font-semibold line-through text-white/80">
                    {formatPriceWithCurrency(String(pricing.compare), pricing.currencyCode)}
                  </span>
                  <span className="inline-block rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                    <span className="text-gold font-semibold text-sm">
                      {formatPriceWithCurrency(String(pricing.price), pricing.currencyCode)}
                    </span>
                  </span>
                </>
              ) : (
                <span className="inline-block rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                  <span className="font-semibold text-sm text-white">
                    {formatPriceWithCurrency(String(pricing.price), pricing.currencyCode)}
                  </span>
                </span>
              )}
            </div>
          </Link>
        </div>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-3 bg-black/60 transition-opacity duration-200",
            hovered ? "opacity-100" : "opacity-0",
          )}
        >
          <Link
            href={`/products/${product.handle}`}
            onClick={(e) => e.stopPropagation()}
            aria-label="View product"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary hover:bg-white/90 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={(e) => onAddToCart(e, product)}
            disabled={!isAvailable || isAdding}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gold text-primary hover:bg-gold/90 transition-colors disabled:opacity-50"
            aria-label="Add to cart"
          >
            {isAdding ? (
              <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Banner under image: Reviews + In Stock */}
      <div className="flex items-center justify-between gap-2 bg-background/80 border border-border rounded-b-lg px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-500">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" strokeWidth={0.5} />
          ))}
          <span className="text-muted-foreground ml-0.5">Reviews</span>
        </div>
        <span className={cn("font-medium", isAvailable ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
          {isAvailable ? "In Stock" : "Out of Stock"}
        </span>
      </div>
    </div>
  )
}

export function FeaturedProducts() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [products, setProducts] = useState<Product[]>([])
  const [addingId, setAddingId] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const FIVE_MINUTES_MS = 5 * 60 * 1000
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
    const interval = setInterval(loadProducts, FIVE_MINUTES_MS)
    return () => clearInterval(interval)
  }, [])

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

  return (
    <section ref={ref} className="py-20 md:py-32 bg-primary" id="products">
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
            variant="dark"
            className="mb-0"
          />
        </div>

        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: isRevealed ? "200ms" : "0ms" }}
        >
          {products.length === 0 ? (
            Array.from({ length: FEATURED_COUNT }).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-primary-foreground/10 animate-pulse" />
                <div className="h-10 bg-primary-foreground/10 border border-white/10 rounded-b-lg" />
              </div>
            ))
          ) : (
            products.map((product, index) => (
              <div key={product.id} style={{ transitionDelay: `${index * 50}ms` }}>
                <FeaturedProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAdding={addingId === product.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
