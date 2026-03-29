"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Eye } from "lucide-react"
import { cn, formatPriceWithCurrency } from "@/lib/utils"
import { getCardPricing } from "@/lib/sale-helpers"
import type { Product } from "@/lib/shopify-types"

export interface ProductTileProps {
  product: Product
  /** Aspect ratio of the image area */
  aspect?: "square" | "4/3"
  /** Dark = for use on primary/dark sections (e.g. Materials & Craft). Light = for use on cream/light (e.g. shop grid). */
  variant?: "dark" | "light"
  onAddToCart?: (e: React.MouseEvent, product: Product) => void
  isAdding?: boolean
}

export function ProductTile({
  product,
  aspect = "square",
  variant = "light",
  onAddToCart,
  isAdding = false,
}: ProductTileProps) {
  const [hovered, setHovered] = useState(false)
  const images = product.images?.length ? product.images : [{ id: "pl", url: "/placeholder.svg", altText: product.title || "Product", width: 400, height: 400 }]
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

  const isDark = variant === "dark"
  const stripBg = isDark ? "bg-gradient-to-t from-primary/95 to-transparent" : "bg-gradient-to-t from-black/80 to-transparent"
  const titleClass = isDark ? "text-primary-foreground" : "text-white"
  const priceMutedClass = isDark ? "text-primary-foreground/70" : "text-white/80"
  const overlayBg = isDark ? "bg-primary/70" : "bg-black/60"
  const viewButtonClass = isDark
    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
    : "bg-white text-primary hover:bg-white/90"

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-lg",
        aspect === "square" ? "aspect-square" : "aspect-[4/3]",
        isDark ? "bg-white/5" : "bg-muted",
      )}
      onMouseEnter={() => { setHovered(true); startHoverCycle() }}
      onMouseLeave={() => { setHovered(false); stopHoverCycle() }}
    >
      {images.map((img, i) => (
        <Image
          key={img.id || i}
          src={img.url}
          alt={img.altText || product.title || "Product"}
          fill
          className={cn(
            "object-cover transition-all duration-500 absolute inset-0",
            "group-hover:scale-105",
            i === imageIndex ? "opacity-100 z-0" : "opacity-0 z-[-1] pointer-events-none"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-12 left-0 right-0 z-10 flex flex-wrap justify-center gap-1 px-2" aria-hidden>
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
                "relative w-7 h-7 rounded overflow-hidden border-2 transition-colors flex-shrink-0 shadow",
                i === imageIndex ? "border-white ring-1 ring-white" : "border-white/60 hover:border-white"
              )}
              aria-label={`View image ${i + 1} of ${images.length}`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
                sizes="28px"
              />
            </button>
          ))}
        </div>
      )}

      {onSale && (
        <span className="absolute top-2 left-2 z-10 rounded-md bg-[#0A1931] px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_10px_rgba(74,127,167,0.5),0_0_20px_rgba(10,25,49,0.4)]">
          Sale
        </span>
      )}

      <div className={cn("absolute bottom-0 left-0 right-0 z-10 p-3 pt-6", stripBg)}>
        <Link href={`/products/${product.handle}`} onClick={(e) => e.stopPropagation()} className="block">
          <p className={cn("font-medium text-sm truncate", titleClass)}>{product.title}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            {onSale ? (
              <>
                <span className={cn("inline-block rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm text-xs font-semibold line-through", priceMutedClass)}>
                  {formatPriceWithCurrency(String(pricing.compare), pricing.currencyCode)}
                </span>
                <span className="inline-block rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                  <span className="text-red-400 font-bold text-sm">
                    {formatPriceWithCurrency(String(pricing.price), pricing.currencyCode)}
                  </span>
                </span>
              </>
            ) : (
              <span className="inline-block rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                <span className="font-bold text-sm text-red-400">
                  {formatPriceWithCurrency(String(pricing.price), pricing.currencyCode)}
                </span>
              </span>
            )}
          </div>
        </Link>
      </div>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-200",
          overlayBg,
          hovered ? "opacity-100" : "opacity-0",
        )}
      >
        <Link
          href={`/products/${product.handle}`}
          onClick={(e) => e.stopPropagation()}
          aria-label="View product"
          className={cn(
            "inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors",
            viewButtonClass,
          )}
        >
          <Eye className="h-4 w-4" />
        </Link>
        {onAddToCart && (
          <button
            type="button"
            onClick={(e) => onAddToCart(e, product)}
            disabled={isAdding}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gold text-primary hover:bg-gold/90 transition-colors disabled:opacity-60"
            aria-label="Add to cart"
          >
            {isAdding ? (
              <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" aria-hidden />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
