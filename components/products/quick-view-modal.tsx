"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Minus, Plus } from "lucide-react"
import type { Product, ProductVariant } from "@/lib/shopify-types"
import { useCart } from "@/components/cart/cart-context"
import { useToast } from "@/hooks/use-toast"
import { cn, formatPrice } from "@/lib/utils"

interface QuickViewModalProps {
  product: Product
  open: boolean
  onClose: () => void
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  if (!open) return null

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity)
    toast({
      title: "Added to cart",
      description: `${product.title} (${selectedVariant.title}) has been added to your cart.`,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-secondary">
            <Image
              src={product.images[0]?.url || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="p-6 md:p-8 flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-gold mb-2">
              {product.category || "Accessories"}
            </span>
            <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-semibold">{formatPrice(selectedVariant.price, selectedVariant.currencyCode || product.currencyCode || "EUR")}</span>
              {selectedVariant.compareAtPrice && (
                <span className="text-muted-foreground line-through">{formatPrice(selectedVariant.compareAtPrice, selectedVariant.currencyCode || product.currencyCode || "EUR")}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  {product.variants[0].selectedOptions[0]?.name || "Option"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        "px-4 py-2 border rounded text-sm font-medium transition-colors",
                        selectedVariant.id === variant.id
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border hover:border-gold",
                      )}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-0 border border-border rounded w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-secondary transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="mt-auto w-full py-4 bg-primary text-primary-foreground font-medium uppercase tracking-wider hover:bg-navy-light transition-colors btn-press gold-glow"
            >
              Add to Cart — {formatPrice((Number.parseFloat(selectedVariant.price) * quantity).toString(), selectedVariant.currencyCode || product.currencyCode || "EUR")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
