"use client"

import Image from "next/image"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"
import { usePromotions } from "./promotions-context"
import { CartSummary } from "./cart-summary"
import { CartDiscountCodeInput } from "./cart-discount-code"
import { cn, formatPriceWithCurrency } from "@/lib/utils"
import { getSaleState } from "@/lib/sale-helpers"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    applyDiscountCode,
    removeDiscountCode,
    isLoading,
    error,
    clearError,
  } = useCart()
  const { hasFreeShipping } = usePromotions()

  const currencyCode =
    cart.currencyCode ?? cart.lines[0]?.variant?.currencyCode ?? "AED"

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 shadow-2xl transition-transform duration-500 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold tracking-wide uppercase">
              Your Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:text-gold transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mx-4 mt-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 flex items-center justify-between gap-2">
              <p className="text-sm text-destructive">{error}</p>
              <button
                type="button"
                onClick={clearError}
                className="text-destructive hover:underline text-xs shrink-0"
                aria-label="Dismiss"
              >
                Dismiss
              </button>
            </div>
          )}

          {cart.lines.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-6">
                Add some premium accessories to get started.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-navy-light transition-colors btn-press"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.lines.map((line) => {
                  const lineTotal =
                    line.lineTotal ??
                    (
                      Number.parseFloat(line.variant.price) * line.quantity
                    ).toFixed(2)
                  const lineVariantForSale = {
                    price: line.variant.price,
                    compareAtPrice: line.compareAtPrice ?? line.variant.compareAtPrice ?? undefined,
                    currencyCode: line.variant.currencyCode ?? cart.currencyCode ?? "AED",
                  }
                  const saleState = getSaleState(lineVariantForSale)
                  const hasSale = saleState.isOnSale
                  const wasTotal = hasSale && saleState.compareAt
                    ? (Number.parseFloat(saleState.compareAt) * line.quantity).toFixed(2)
                    : null
                  const savingsTotal =
                    hasSale && wasTotal
                      ? (
                          Number.parseFloat(wasTotal) -
                          Number.parseFloat(lineTotal)
                        ).toFixed(2)
                      : null

                  return (
                    <div key={line.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                        {hasSale && (
                          <span className="absolute top-1 left-1 z-10 rounded bg-red-600 text-white text-[10px] font-semibold uppercase px-1.5 py-0.5">
                            Sale
                          </span>
                        )}
                        <Image
                          src={
                            line.product.images[0]?.url ?? "/placeholder.svg"
                          }
                          alt={line.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 truncate">
                          {line.product.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {line.variant.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-border rounded">
                            <button
                              onClick={() =>
                                updateQuantity(line.id, line.quantity - 1)
                              }
                              className="p-1.5 hover:bg-secondary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm">
                              {line.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(line.id, line.quantity + 1)
                              }
                              className="p-1.5 hover:bg-secondary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(line.id)}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-start">
                        {hasSale && wasTotal && (
                          <>
                            <p className="text-xs text-muted-foreground line-through">
                              Was{" "}
                              {formatPriceWithCurrency(wasTotal, currencyCode)}
                            </p>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">
                              Now{" "}
                              {formatPriceWithCurrency(
                                lineTotal,
                                currencyCode
                              )}
                            </p>
                            {savingsTotal &&
                              Number.parseFloat(savingsTotal) > 0 &&
                              saleState.percentOff > 0 && (
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                                  Save{" "}
                                  {formatPriceWithCurrency(
                                    savingsTotal,
                                    currencyCode
                                  )}{" "}
                                  ({saleState.percentOff}%)
                                </p>
                              )}
                          </>
                        )}
                        {!hasSale && (
                          <p className="font-medium">
                            {formatPriceWithCurrency(
                              lineTotal,
                              currencyCode
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-6 border-t border-border bg-secondary/50 space-y-4">
                <CartDiscountCodeInput
                  appliedCodes={cart.discountCodes ?? []}
                  onApply={applyDiscountCode}
                  onRemove={removeDiscountCode}
                  isLoading={isLoading}
                />

                {hasFreeShipping && (
                  <div className="space-y-1">
                    {cart.totalQuantity >= 2 ? (
                      <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                          Free delivery unlocked
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                          Add {2 - cart.totalQuantity} more item
                          {2 - cart.totalQuantity > 1 ? "s" : ""} for free delivery
                        </p>
                        <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                          Free shipping on orders with 2+ items
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <CartSummary cart={cart} />

                <button
                  onClick={() => {
                    if (cart.checkoutUrl)
                      window.location.href = cart.checkoutUrl
                  }}
                  disabled={isLoading || !cart.checkoutUrl}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-navy-light transition-colors btn-press gold-glow disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isLoading ? "Updating…" : "Proceed to Checkout"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
