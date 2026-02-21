"use client"

import { useState } from "react"
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
                  <span className="text-gold font-semibold text-sm">
                    {formatPriceWithCurrency(String(pricing.price), pricing.currencyCode)}
                  </span>
                </span>
              </>
            ) : (
              <span className="inline-block rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm">
                <span className={cn("font-semibold text-sm", titleClass)}>
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
