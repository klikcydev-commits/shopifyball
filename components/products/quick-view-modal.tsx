"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, ExternalLink } from "lucide-react"
import type { Product, ProductVariant } from "@/lib/shopify-types"
import { useCart } from "@/components/cart/cart-context"
import { usePromotions } from "@/components/cart/promotions-context"
import { useToast } from "@/hooks/use-toast"
import { cn, formatPrice, formatPriceWithCurrency } from "@/lib/utils"
import { getCardPricing, getSaleState } from "@/lib/sale-helpers"

interface QuickViewModalProps {
  product: Product
  open: boolean
  onClose: () => void
  /** Optional ref to the trigger button; focus returns here on close for accessibility. */
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

const PLACEHOLDER_IMAGE = "/placeholder.svg"
const BACKDROP_Z = 100
const MODAL_Z = 101

function stripHtml(html: string | undefined): string {
  if (html == null || html === "") return ""
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

export function QuickViewModal({ product, open, onClose, triggerRef }: QuickViewModalProps) {
  const variants = product.variants ?? []
  const firstVariant = variants[0] ?? null

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(firstVariant)
  const [quantity, setQuantity] = useState(1)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalContainerRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()
  const { hasActivePromos, isLoading: promosLoading } = usePromotions()
  const { toast } = useToast()

  const FOCUSABLE =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  // Sync state when product or open changes (reset selection when modal opens)
  useEffect(() => {
    if (!open) return
    const list = product.variants ?? []
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional sync when modal opens
    setSelectedVariant(list[0] ?? null)
    setQuantity(1)
  }, [open, product.id])

  // Body scroll lock when modal is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  // Focus close button when opened; return focus to trigger on close
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeButtonRef.current?.focus(), 100)
      return () => {
        clearTimeout(t)
        if (triggerRef?.current) {
          triggerRef.current.focus()
        }
      }
    }
  }, [open, triggerRef])

  // Escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open || e.key !== "Escape") return
      e.preventDefault()
      onClose()
    },
    [open, onClose]
  )
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Focus trap: keep Tab/Shift+Tab inside the modal
  useEffect(() => {
    if (!open || !modalContainerRef.current) return
    const el = modalContainerRef.current
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => !node.hasAttribute("disabled") && node.tabIndex !== -1
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", handleTab)
    return () => document.removeEventListener("keydown", handleTab)
  }, [open])

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast({ title: "Error", description: "Please select an option.", variant: "destructive" })
      return
    }
    if (!selectedVariant.availableForSale) {
      toast({ title: "Out of stock", description: "This variant is unavailable.", variant: "destructive" })
      return
    }
    try {
      await addToCart(product, selectedVariant, quantity)
      onClose()
      toast({ title: "Added to cart", description: `${product.title} (×${quantity})` })
    } catch {
      toast({ title: "Error", description: "Failed to add to cart.", variant: "destructive" })
    }
  }

  const imageUrl = product.images?.[0]?.url || PLACEHOLDER_IMAGE
  const description = stripHtml(product.description)
  const variantForSale = selectedVariant
    ? {
        price: selectedVariant.price,
        compareAtPrice: selectedVariant.compareAtPrice ?? undefined,
        currencyCode: selectedVariant.currencyCode ?? product.currencyCode ?? "AED",
      }
    : null
  const cardPricing = getCardPricing(variantForSale)
  const saleState = getSaleState(variantForSale)
  const currencyCode = cardPricing.currencyCode
  const optionName = variants[0]?.selectedOptions?.[0]?.name ?? "Option"
  const canAddToCart = selectedVariant && selectedVariant.availableForSale

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const modalContent = (
    <>
      {/* Backdrop: fixed inset-0, high z-index */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        style={{ zIndex: BACKDROP_Z }}
        onClick={handleBackdropClick}
        aria-hidden
      />

      {/* Modal: fixed center of viewport, max-height, internal scroll */}
      <div
        ref={modalContainerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-3xl max-h-[85vh] sm:max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-background shadow-2xl flex flex-col animate-in zoom-in-95 fade-in-0 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0"
        style={{ zIndex: MODAL_Z }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-background/90 hover:bg-background border border-border shadow-sm transition-colors sm:top-4 sm:right-4"
          aria-label="Close quick view"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0 overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square min-h-[220px] sm:min-h-[280px] bg-secondary flex-shrink-0">
            <Image
              src={imageUrl}
              alt={product.title || "Product"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={imageUrl === PLACEHOLDER_IMAGE}
            />
          </div>

          {/* Info - scrollable when content is long */}
          <div className="p-4 sm:p-6 md:p-8 flex flex-col overflow-y-auto min-h-0">
            <span className="text-xs uppercase tracking-[0.2em] text-gold mb-1 sm:mb-2">
              {product.category || "Accessories"}
            </span>
            <h2 id="quick-view-title" className="text-xl font-semibold mb-2 sm:text-2xl">
              {product.title || "Untitled Product"}
            </h2>

            {selectedVariant ? (
              <div className="mb-4">
                {cardPricing.isSale && (
                  <span className="inline-block rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 mb-2">
                    Sale
                  </span>
                )}
                <div className="flex flex-col gap-0.5">
                  {cardPricing.isSale ? (
                    <>
                      <span className="line-through opacity-70 text-sm text-zinc-500 dark:text-zinc-400">
                        {formatPriceWithCurrency(String(cardPricing.compare), currencyCode)}
                      </span>
                      <span className="font-semibold text-xl text-zinc-900 dark:text-zinc-100">
                        {formatPriceWithCurrency(String(cardPricing.price), currencyCode)}
                      </span>
                      {saleState.percentOff > 0 && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Save {saleState.saveAmountText} ({saleState.savePercentText})
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="font-semibold text-xl text-zinc-900 dark:text-zinc-100">
                      {formatPriceWithCurrency(String(cardPricing.price), currencyCode)}
                    </span>
                  )}
                </div>
                {!promosLoading && hasActivePromos && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Deal available at checkout
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">No variants available.</p>
            )}

            {description && (
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-4">
                {description}
              </p>
            )}

            {variants.length > 1 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">{optionName}</label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.availableForSale}
                      className={cn(
                        "px-4 py-2 border rounded text-sm font-medium transition-colors",
                        selectedVariant?.id === variant.id
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border hover:border-gold",
                        !variant.availableForSale && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {firstVariant && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-0 border border-border rounded w-fit">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 font-medium min-w-[2rem] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-3">
              {canAddToCart && selectedVariant && (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Add to Cart —{" "}
                  {formatPrice(
                    (Number.parseFloat(selectedVariant.price) * quantity).toString(),
                    currencyCode
                  )}
                </button>
              )}
              <Link
                href={`/products/${product.handle}`}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 w-full py-3 border border-border rounded font-medium text-sm hover:border-gold hover:text-gold transition-colors"
              >
                View full details
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  if (!open) return null

  // Portal to document.body so modal is never inside a section/grid (fixes positioning)
  if (typeof document === "undefined") return null
  return createPortal(modalContent, document.body)
}
