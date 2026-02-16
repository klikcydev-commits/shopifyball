"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Eye, Check } from "lucide-react"
import type { Product } from "@/lib/shopify-types"
import { useCart } from "@/components/cart/cart-context"
import { useToast } from "@/hooks/use-toast"
import { cn, formatPrice } from "@/lib/utils"
import { QuickViewModal } from "./quick-view-modal"

interface ProductCardProps {
  product: Product
  size?: "default" | "large"
}

export function ProductCard({ product, size = "default" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.variants || product.variants.length === 0) {
      toast({
        title: "Error",
        description: "This product has no available variants.",
        variant: "destructive",
      })
      return
    }

    if (!product.variants[0].availableForSale) {
      toast({
        title: "Out of stock",
        description: "This product is currently unavailable.",
        variant: "destructive",
      })
      return
    }

    setIsAdding(true)
    try {
      addToCart(product, product.variants[0])
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const isAvailable = product.availableForSale && product.variants?.some(v => v.availableForSale)
  const hasDiscount = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price || "0")

  return (
    <>
      <div 
        className="group relative flex flex-col h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.handle}`} className="flex flex-col h-full">
          {/* Image Container */}
          <div
            className={cn(
              "relative bg-gradient-to-br from-secondary to-secondary/80 rounded-xl overflow-hidden mb-4 transition-all duration-500",
              size === "large" ? "aspect-[3/4]" : "aspect-square",
              "group-hover:shadow-2xl group-hover:shadow-gold/20",
              !isAvailable && "opacity-60"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover:from-black/5 transition-all duration-500 z-10" />
            
            <Image
              src={product.images?.[0]?.url || "/placeholder.svg"}
              alt={product.title || "Product"}
              fill
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                isHovered ? "scale-110" : "scale-100"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={false}
            />

            {/* Badges - Top Left */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              {hasDiscount && (
                <span className="px-3 py-1.5 bg-gold text-primary text-xs font-bold uppercase tracking-wider rounded-full shadow-lg backdrop-blur-sm">
                  Sale
                </span>
              )}
              {product.tags?.includes("11kit") && (
                <span className="px-3 py-1.5 bg-primary/95 text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg backdrop-blur-sm">
                  11Kit
                </span>
              )}
              {!isAvailable && (
                <span className="px-3 py-1.5 bg-destructive/95 text-destructive-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg backdrop-blur-sm">
                  Sold Out
                </span>
              )}
            </div>

            {/* Quick Actions - Bottom Overlay */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent transition-all duration-300 z-20",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsQuickViewOpen(true)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-primary text-sm font-semibold rounded-lg hover:bg-white/95 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">View</span>
                </button>
                <button
                  onClick={handleQuickAdd}
                  disabled={!isAvailable || isAdding}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 px-4 bg-gold text-primary font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                    isAvailable && !isAdding && "hover:bg-gold-light"
                  )}
                  aria-label="Add to cart"
                >
                  {isAdding ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span className="hidden sm:inline">Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Hover Indicator */}
            <div
              className={cn(
                "absolute inset-0 border-2 border-gold/0 rounded-xl transition-all duration-300 pointer-events-none",
                isHovered && "border-gold/30"
              )}
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col flex-1 px-1">
            <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2 group-hover:text-gold transition-colors duration-200 min-h-[3rem]">
              {product.title || "Untitled Product"}
            </h3>
            
            {/* Price */}
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.price || "0.00", product.currencyCode || "AED")}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!, product.currencyCode || "AED")}
                </span>
              )}
            </div>

            {/* Availability Indicator */}
            {isAvailable && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600 dark:text-green-400">
                <Check className="h-3 w-3" />
                <span>In Stock</span>
              </div>
            )}
          </div>
        </Link>
      </div>

      <QuickViewModal product={product} open={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  )
}
