"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { X, Check, Sparkles } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { products } from "@/lib/mock-data"
import type { Product } from "@/lib/shopify-types"
import { useCart } from "@/components/cart/cart-context"
import { useToast } from "@/hooks/use-toast"

// Formation positions with categories
const formationSlots = [
  { id: 1, position: "GK", category: "Bottles & Essentials", x: 50, y: 88 },
  { id: 2, position: "LB", category: "Socks & Grip", x: 15, y: 68 },
  { id: 3, position: "CB", category: "Bags & Carry", x: 35, y: 68 },
  { id: 4, position: "CB", category: "Bags & Carry", x: 65, y: 68 },
  { id: 5, position: "RB", category: "Bags & Carry", x: 85, y: 68 },
  { id: 6, position: "LM", category: "Headwear", x: 18, y: 42 },
  { id: 7, position: "CM", category: "Match Day Kits", x: 50, y: 42 },
  { id: 8, position: "RM", category: "Headwear", x: 82, y: 42 },
  { id: 9, position: "LW", category: "Collectibles", x: 20, y: 18 },
  { id: 10, position: "ST", category: "Headwear", x: 50, y: 12 },
  { id: 11, position: "RW", category: "Collectibles", x: 80, y: 18 },
]

interface SelectedItem {
  slotId: number
  product: Product
}

export function KitBuilder() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [activeSlot, setActiveSlot] = useState<number | null>(null)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const getProductsForCategory = (category: string) => {
    return products.filter(
      (p) =>
        p.category === category || p.tags.some((t) => t.toLowerCase().includes(category.toLowerCase().split(" ")[0])),
    )
  }

  const getSelectedProduct = (slotId: number) => {
    return selectedItems.find((item) => item.slotId === slotId)?.product
  }

  const handleSelectProduct = useCallback((slotId: number, product: Product) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.slotId === slotId)
      if (existing) {
        return prev.map((item) => (item.slotId === slotId ? { ...item, product } : item))
      }
      return [...prev, { slotId, product }]
    })
    setActiveSlot(null)
  }, [])

  const handleRemoveProduct = useCallback((slotId: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.slotId !== slotId))
  }, [])

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + Number.parseFloat(item.product.price), 0).toFixed(2)
  }

  const handleAddKitToCart = () => {
    for (const item of selectedItems) {
      addToCart(item.product, item.product.variants[0], 1)
    }
    setIsAddedToCart(true)
    toast({
      title: "11Kit Added to Cart!",
      description: `${selectedItems.length} items have been added to your cart.`,
    })
    setTimeout(() => setIsAddedToCart(false), 3000)
  }

  const activeSlotData = activeSlot ? formationSlots.find((s) => s.id === activeSlot) : null

  return (
    <section ref={ref} className="py-20 md:py-32 bg-primary text-primary-foreground" id="kit-builder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            "text-center max-w-2xl mx-auto mb-12 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Step 2</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">Build Your Formation</h2>
          <p className="text-primary-foreground/70 text-lg">
            Click any position to select an accessory. Fill all 11 slots for the complete kit.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Formation field */}
          <div
            className={cn(
              "lg:col-span-2 transition-all duration-700",
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12",
            )}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="relative aspect-[4/5] rounded-2xl bg-gradient-to-b from-navy-light/50 to-primary/50 border border-gold/20 overflow-hidden">
              {/* Pitch lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Center line */}
                <line
                  x1="0"
                  y1="50"
                  x2="100"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-gold/20"
                />
                {/* Center circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-gold/20"
                />
                {/* Top penalty area */}
                <rect
                  x="30"
                  y="0"
                  width="40"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-gold/20"
                />
                {/* Bottom penalty area */}
                <rect
                  x="30"
                  y="84"
                  width="40"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-gold/20"
                />
                {/* Goal arcs */}
                <path
                  d="M 40 16 Q 50 22, 60 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-gold/20"
                />
                <path
                  d="M 40 84 Q 50 78, 60 84"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-gold/20"
                />
              </svg>

              {/* Formation slots */}
              {formationSlots.map((slot, index) => {
                const selectedProduct = getSelectedProduct(slot.id)
                return (
                  <button
                    key={slot.id}
                    onClick={() => setActiveSlot(slot.id)}
                    className={cn(
                      "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group",
                      activeSlot === slot.id ? "scale-110 z-20" : "hover:scale-105",
                    )}
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Slot circle */}
                    <div
                      className={cn(
                        "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all border-2",
                        selectedProduct
                          ? "bg-gold border-gold text-primary"
                          : activeSlot === slot.id
                            ? "bg-gold/20 border-gold text-gold"
                            : "bg-white/5 border-gold/40 text-gold group-hover:bg-gold/10 group-hover:border-gold",
                      )}
                    >
                      {selectedProduct ? (
                        <Check className="h-5 w-5 md:h-6 md:w-6" />
                      ) : (
                        <span className="text-sm md:text-base font-bold">{slot.id}</span>
                      )}
                    </div>

                    {/* Tooltip */}
                    <div
                      className={cn(
                        "absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs font-medium transition-opacity",
                        "bg-gold text-primary",
                        activeSlot === slot.id || selectedProduct ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                      )}
                    >
                      {selectedProduct?.title.split("—")[0].trim() || slot.category}
                    </div>
                  </button>
                )
              })}

              {/* Progress indicator */}
              <div className="absolute bottom-4 left-4 right-4 bg-primary/90 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gold">Progress</span>
                  <span className="text-sm text-primary-foreground/60">{selectedItems.length}/11 selected</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${(selectedItems.length / 11) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div
            className={cn(
              "transition-all duration-700",
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12",
            )}
            style={{ transitionDelay: "300ms" }}
          >
            {/* Customize panel or summary */}
            {activeSlot && activeSlotData ? (
              <div className="bg-white/5 rounded-2xl p-6 border border-gold/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gold">Position {activeSlot}</span>
                    <h3 className="text-lg font-semibold">{activeSlotData.category}</h3>
                  </div>
                  <button
                    onClick={() => setActiveSlot(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close panel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Product options */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {getProductsForCategory(activeSlotData.category).map((product) => {
                    const isSelected = getSelectedProduct(activeSlot)?.id === product.id
                    return (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(activeSlot, product)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                          isSelected
                            ? "border-gold bg-gold/10"
                            : "border-white/10 hover:border-gold/40 hover:bg-white/5",
                        )}
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                          <Image
                            src={product.images[0]?.url || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.title.split("—")[0].trim()}</p>
                          <p className="text-xs text-primary-foreground/50">{formatPrice(product.price, product.currencyCode || "EUR")}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl p-6 border border-gold/20 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Your 11Kit</h3>

                {selectedItems.length === 0 ? (
                  <p className="text-sm text-primary-foreground/50 mb-6">
                    Click on any position in the formation to start building your kit.
                  </p>
                ) : (
                  <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                    {selectedItems
                      .sort((a, b) => a.slotId - b.slotId)
                      .map((item) => (
                        <div key={item.slotId} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-xs font-bold text-gold">
                            {item.slotId}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product.title.split("—")[0].trim()}</p>
                          </div>
                          <span className="text-sm text-gold">{formatPrice(item.product.price, item.product.currencyCode || "EUR")}</span>
                          <button
                            onClick={() => handleRemoveProduct(item.slotId)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            aria-label={`Remove ${item.product.title}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}

                {/* Summary */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-foreground/60">Items selected</span>
                    <span className="font-medium">{selectedItems.length}/11</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-foreground/60">Total</span>
                    <span className="text-xl font-bold text-gold">€{calculateTotal()}</span>
                  </div>
                  <p className="text-xs text-primary-foreground/40">Estimated shipping calculated at checkout</p>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddKitToCart}
                  disabled={selectedItems.length === 0}
                  className={cn(
                    "w-full mt-6 py-4 font-medium uppercase tracking-wider transition-all btn-press flex items-center justify-center gap-2",
                    selectedItems.length > 0
                      ? "bg-gold text-primary hover:bg-gold-light gold-glow"
                      : "bg-white/10 text-primary-foreground/40 cursor-not-allowed",
                  )}
                >
                  {isAddedToCart ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Added to Cart!
                    </>
                  ) : (
                    <>Add 11Kit to Cart</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
