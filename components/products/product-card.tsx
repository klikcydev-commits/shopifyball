"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Product } from "@/lib/shopify-types"
import { useCart } from "@/components/cart/cart-context"
import { usePromotions } from "@/components/cart/promotions-context"
import { useToast } from "@/hooks/use-toast"
import { cn, formatPriceWithCurrency } from "@/lib/utils"
import { getCardPricing } from "@/lib/sale-helpers"
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
  const cardPricing = getCardPricing(variantForSale)
  const onSale = cardPricing.isSale

  const images = product.images?.length ? product.images : [{ id: "", url: "/placeholder.svg", altText: product.title || "Product", width: 400, height: 400 }]
  const [imageIndex, setImageIndex] = useState(0)
  const hoverIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)
    }
  }, [])

  const startHoverCycle = () => {
    if (images.length <= 1) return
    setImageIndex((i) => (i + 1) % images.length)
    hoverIntervalRef.current = setInterval(() => {
      setImageIndex((i) => (i + 1) % images.length)
    }, 2000)
  }

  const stopHoverCycle = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current)
      hoverIntervalRef.current = null
    }
    setImageIndex(0)
  }

  const originalPriceStr =
    cardPricing.isSale
      ? formatPriceWithCurrency(String(cardPricing.compare), cardPricing.currencyCode)
      : ""
  const salePriceStr = formatPriceWithCurrency(String(cardPricing.price), cardPricing.currencyCode)

  return (
    <>
      <motion.article
        className={cn(
          "w-full flex-shrink-0 bg-[#ffffff] rounded-xl overflow-hidden group cursor-pointer",
          size === "large" ? "w-[200px] sm:w-[280px] md:w-[300px]" : "w-[170px] sm:w-[220px] md:w-[260px]"
        )}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => { setIsHovered(true); startHoverCycle() }}
        onMouseLeave={() => { setIsHovered(false); stopHoverCycle() }}
      >
        {/* Image container – fixed aspect so all cards same image height; cycle through images on hover */}
        <div className="relative w-full aspect-[3/4] shrink-0 overflow-hidden">
          <Link href={`/products/${product.handle}`} className="block absolute inset-0 z-0">
            {images.map((img, i) => (
              <Image
                key={img.id || i}
                src={img.url}
                alt={img.altText || product.title || "Product"}
                fill
                className={cn(
                  "object-cover transition-all duration-300 absolute inset-0",
                  isHovered ? "scale-105" : "scale-100",
                  i === imageIndex ? "opacity-100 z-0" : "opacity-0 z-[-1] pointer-events-none"
                )}
                sizes="(max-width: 640px) 170px, (max-width: 768px) 220px, 260px"
              />
            ))}
          </Link>
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1" aria-hidden>
              {images.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-200",
                    i === imageIndex ? "w-3 bg-white/90" : "w-1 bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
          {onSale && (
            <span className="absolute top-2.5 left-2.5 md:top-3 md:left-3 bg-[#0A1931] text-white text-[10px] md:text-xs font-bold px-3 md:px-4 py-1 md:py-1.5 rounded-full z-10 shadow-[0_0_12px_rgba(74,127,167,0.6),0_0_24px_rgba(10,25,49,0.5)] animate-pulse">
              Sale
            </span>
          )}
          {!promosLoading && hasActivePromos && (
            <span className="absolute top-2.5 right-2.5 md:top-3 md:right-3 bg-green-600 text-white text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full z-10">
              Deal
            </span>
          )}
          {!isAvailable && (
            <span className="absolute top-2.5 left-2.5 md:top-3 md:left-3 bg-destructive text-destructive-foreground text-[10px] md:text-xs font-bold px-3 md:px-4 py-1 md:py-1.5 rounded-full z-10">
              Sold Out
            </span>
          )}
          {isAvailable && (
            <button
              type="button"
              onClick={openQuickView}
              className={cn(
                "absolute inset-0 z-[1] flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200",
                isHovered && "opacity-100"
              )}
              aria-label={`Quick view ${product.title}`}
            >
              <span className="rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg">
                Quick view
              </span>
            </button>
          )}
        </div>

        {/* Small image thumbnails under the main image */}
        {images.length > 1 && (
          <div className="flex flex-wrap justify-center gap-1.5 px-2 py-2 bg-[#fafafa] border-b border-[#e5e5e5]">
            {images.map((img, i) => (
              <button
                key={img.id || i}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setImageIndex(i)
                  if (hoverIntervalRef.current) {
                    clearInterval(hoverIntervalRef.current)
                    hoverIntervalRef.current = null
                  }
                }}
                className={cn(
                  "relative w-9 h-9 sm:w-10 sm:h-10 rounded-md overflow-hidden border-2 transition-colors flex-shrink-0",
                  i === imageIndex ? "border-[#1a1a1a] ring-1 ring-[#1a1a1a]" : "border-transparent hover:border-[#999]"
                )}
                aria-label={`View image ${i + 1} of ${images.length}`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || product.title || "Product"}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Card content – fixed height so all cards stay same size, generous to avoid cropping */}
        <div className="flex flex-col px-3 pt-4 pb-4 md:px-4 md:pt-4 md:pb-5 h-[168px] md:h-[176px]">
          <Link href={`/products/${product.handle}`} onClick={(e) => e.stopPropagation()} className="block flex-shrink-0">
            <h3 className="text-[#1a1a1a] font-bold text-[11px] md:text-sm uppercase leading-snug tracking-wide text-center hover:underline line-clamp-2 min-h-[2.4em]">
              {product.title || "Untitled Product"}
            </h3>
          </Link>
          <div className="mt-2 flex items-center justify-center gap-2 md:gap-3 flex-shrink-0">
            {onSale && (
              <span className="text-[#999999] text-[10px] md:text-sm line-through">{originalPriceStr}</span>
            )}
            <span className="text-[#1a1a1a] text-[11px] md:text-base font-semibold">
              {salePriceStr}
            </span>
          </div>
          <div className="flex-1 min-h-[12px]" aria-hidden />
          <div className="flex-shrink-0 border-t border-[#e5e5e5] pt-4">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable || isAdding}
              className={cn(
                "w-full min-h-[44px] py-2.5 md:py-3 border border-[#1a1a1a] rounded-lg text-[#1a1a1a] text-xs md:text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                isAvailable && !isAdding && "hover:bg-[#1a1a1a] hover:text-[#ffffff]"
              )}
              aria-label="Add to cart"
            >
              {isAdding ? "Adding…" : "Add to cart"}
            </button>
          </div>
        </div>
      </motion.article>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  )
}
