"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Eye } from "lucide-react"
import type { Product } from "@/lib/shopify-types"
import { useCart } from "@/components/cart/cart-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { QuickViewModal } from "./quick-view-modal"

interface ProductCardProps {
  product: Product
  size?: "default" | "large"
}

export function ProductCard({ product, size = "default" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleQuickAdd = () => {
    if (!product.variants || product.variants.length === 0) {
      toast({
        title: "Error",
        description: "This product has no available variants.",
        variant: "destructive",
      })
      return
    }
    addToCart(product, product.variants[0])
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    })
  }

  return (
    <>
      <div className="group relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Image */}
        <div
          className={cn(
            "relative bg-secondary rounded-lg overflow-hidden card-hover",
            size === "large" ? "aspect-[3/4]" : "aspect-square",
          )}
        >
          <Image
            src={product.images?.[0]?.url || "/placeholder.svg"}
            alt={product.title || "Product"}
            fill
            className={cn("object-cover transition-transform duration-700", isHovered && "scale-105")}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.compareAtPrice && (
              <span className="px-2 py-1 bg-gold text-primary text-xs font-medium uppercase tracking-wider">Sale</span>
            )}
            {product.tags?.includes("11kit") && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium uppercase tracking-wider">
                11Kit
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="flex gap-2">
              <button
                onClick={() => setIsQuickViewOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/90 text-primary text-sm font-medium rounded hover:bg-white transition-colors btn-press"
              >
                <Eye className="h-4 w-4" />
                Quick View
              </button>
              <button
                onClick={handleQuickAdd}
                className="p-2.5 bg-gold text-primary rounded hover:bg-gold-light transition-colors btn-press"
                aria-label="Add to cart"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4">
          <h3 className="font-medium text-sm mb-1 group-hover:text-gold transition-colors">{product.title || "Untitled Product"}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">€{product.price || "0.00"}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">€{product.compareAtPrice}</span>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal product={product} open={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  )
}
