"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, Eye } from "lucide-react"
import { Star } from "lucide-react"
import type { Product } from "@/lib/shopify-types"
import { useCart } from "@/components/cart/cart-context"
import { usePromotions } from "@/components/cart/promotions-context"
import { useToast } from "@/hooks/use-toast"
import { cn, formatPriceWithCurrency } from "@/lib/utils"
import { getSaleState } from "@/lib/sale-helpers"
import { QuickViewModal } from "@/components/products/quick-view-modal"

interface ProductCardProps {
  product: Product
  size?: "default" | "large"
  /** Optional review count for display (e.g. from reviews app). */
  reviewCount?: number
}

export function ProductCard({ product, size = "default", reviewCount }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const quickViewTriggerRef = useRef<HTMLButtonElement>(null)
  const { addToCart } = useCart()
  const { hasActivePromos, isLoading: promosLoading } = usePromotions()
  const { toast } = useToast()

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewOpen(true)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.variants?.length) {
      toast({ title: "Error", description: "No variants available.", variant: "destructive" })
      return
    }
    if (!product.variants[0].availableForSale) {
      toast({ title: "Out of stock", description: "This product is unavailable.", variant: "destructive" })
      return
    }
    setIsAdding(true)
    try {
      await addToCart(product, product.variants[0])
    } catch {
      toast({ title: "Error", description: "Failed to add to cart.", variant: "destructive" })
    } finally {
      setIsAdding(false)
    }
  }

  const isAvailable = product.availableForSale && product.variants?.some((v) => v.availableForSale)
  const displayVariant =
    product.variants?.find((v) => v.availableForSale) ?? product.variants?.[0] ?? null
  const variantForSale = displayVariant
    ? {
        price: displayVariant.price,
        compareAtPrice: displayVariant.compareAtPrice ?? undefined,
        currencyCode: displayVariant.currencyCode ?? product.currencyCode ?? "AED",
      }
    : { price: product.price, compareAtPrice: product.compareAtPrice, currencyCode: product.currencyCode ?? "AED" }
  const saleState = getSaleState(variantForSale)
  const onSale = saleState.isOnSale

  const imageUrl = product.images?.[0]?.url || "/placeholder.svg"
  const category = product.category || product.tags?.[0] || "Product"
  const description = product.description?.replace(/<[^>]*>/g, "").trim() || ""
  const features = (product.tags ?? []).filter((t) => typeof t === "string" && t.length < 25).slice(0, 3)

  return (
    <>
      <motion.article
        className="w-full max-w-[360px] mx-auto max-[400px]:w-[90%] max-[400px]:max-w-none"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={cn("product-card group", !isAvailable && "opacity-75")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badge – top right */}
          <div className="absolute top-[15px] right-[15px] z-10 flex flex-wrap justify-end gap-1.5">
            {(product.tags?.includes("11kit") || product.tags?.includes("premium")) && (
              <span className="product-badge rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-lg">
                Premium
              </span>
            )}
            {!onSale && !product.tags?.includes("11kit") && !product.tags?.includes("premium") && product.tags?.[0] && (
              <span className="product-badge rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-lg">
                {product.tags[0]}
              </span>
            )}
            {!isAvailable && (
              <span className="product-badge rounded-xl bg-destructive text-destructive-foreground px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
                Sold Out
              </span>
            )}
          </div>

          {/* Tilt / image container */}
          <div className="product-tilt-effect overflow-hidden [transform-style:preserve-3d] [perspective:1000px]">
            <div
              className={cn(
                "product-image relative overflow-hidden",
                size === "large" ? "h-[280px] max-[400px]:h-[220px]" : "h-[240px] max-[400px]:h-[200px]"
              )}
            >
              {onSale && (
                <span className="sale-badge absolute top-[12px] left-[12px] z-10 rounded-md bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 shadow-lg">
                  Sale
                </span>
              )}
              <Link href={`/products/${product.handle}`} className="block absolute inset-0 z-0">
                <Image
                  src={imageUrl}
                  alt={product.title || "Product"}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                    isHovered ? "scale-105" : "scale-100"
                  )}
                  sizes="(max-width: 400px) 90vw, 360px"
                />
              </Link>
              <button
                ref={quickViewTriggerRef}
                type="button"
                onClick={openQuickView}
                className={cn(
                  "absolute inset-0 z-[1] flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200",
                  "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-inset",
                  isHovered && "opacity-100"
                )}
                aria-label={`Quick view ${product.title}`}
              >
                <span className="flex items-center gap-2 rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg">
                  <Eye className="h-4 w-4" />
                  Quick view
                </span>
              </button>
            </div>
          </div>

          {/* Product info */}
          <div className="product-info">
            <Link href={`/products/${product.handle}`} onClick={(e) => e.stopPropagation()} className="block">
              <p className="product-category">
                {category}
              </p>
              <h2 className="product-title">
                {product.title || "Untitled Product"}
              </h2>
            </Link>
            {description && (
              <div className="product-description">
                <p className="line-clamp-2">{description}</p>
              </div>
            )}
            {features.length > 0 && (
              <div className="product-features">
                {features.map((tag) => (
                  <span key={tag} className="feature">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="product-bottom">
              {saleState.isOnSale ? (
                <div className="product-price flex flex-col gap-0.5">
                  <del className="price-was block text-sm text-zinc-500 dark:text-zinc-400">
                    {saleState.compareAtText}
                  </del>
                  <span className="price-now font-bold text-zinc-900 dark:text-zinc-100 text-xl">
                    {saleState.priceText}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Save {saleState.saveAmountText} ({saleState.savePercentText})
                  </span>
                  {saleState.percentOff > 0 && (
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                      {saleState.percentOff}% OFF
                    </span>
                  )}
                </div>
              ) : (
                <span className="product-price font-semibold text-xl text-zinc-900 dark:text-zinc-100">
                  {saleState.priceText}
                </span>
              )}
              {!promosLoading && hasActivePromos && (
                <span className="text-xs text-muted-foreground">
                  Deal available at checkout
                </span>
              )}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable || isAdding}
                className="product-button group/btn disabled:opacity-50 disabled:pointer-events-none max-[400px]:w-full"
                aria-label="Add to cart"
              >
                <span className="absolute inset-0 overflow-hidden pointer-events-none">
                  <span className="absolute top-0 left-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out group-hover/btn:translate-x-full" />
                </span>
                {isAdding ? (
                  <span className="relative z-10 flex items-center gap-2">
                    <motion.span
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    />
                    Adding…
                  </span>
                ) : (
                  <>
                    <span className="button-text relative z-10">Add to Cart</span>
                    <ShoppingBag className="button-icon relative z-10 h-5 w-5 transition-transform duration-300 group-hover/btn:rotate-[-10deg] group-hover/btn:scale-110" />
                  </>
                )}
              </button>
            </div>

            <div className="product-meta">
              {reviewCount !== undefined && reviewCount >= 0 && (
                <div className="product-rating">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400 stroke-amber-400"
                      strokeWidth={0.5}
                    />
                  ))}
                  <span className="rating-count ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {reviewCount} Review{reviewCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {reviewCount === undefined && (
                <div className="product-rating">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400 stroke-amber-400"
                      strokeWidth={0.5}
                    />
                  ))}
                  <span className="rating-count ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Reviews
                  </span>
                </div>
              )}
              <div className="product-stock">
                {isAvailable ? "In Stock" : "Out of Stock"}
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        triggerRef={quickViewTriggerRef}
      />
    </>
  )
}
