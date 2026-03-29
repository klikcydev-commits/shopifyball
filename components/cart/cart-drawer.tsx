"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { X, Minus, Plus, ShoppingBag, Banknote, CreditCard } from "lucide-react"
import { useCart } from "./cart-context"
import { CartSummary } from "./cart-summary"
import { TrustBadges } from "@/components/trust-badges"
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
    isLoading,
    error,
    clearError,
  } = useCart()

  type PaymentMethod = "cod" | "online"
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(() => {
    if (typeof window === "undefined") return "cod"
    try {
      const saved = window.localStorage.getItem("paymentMethod") as PaymentMethod | null
      if (saved === "cod" || saved === "online") return saved
    } catch {
      // ignore storage errors
    }
    return "cod"
  })

  useEffect(() => {
    try {
      window.localStorage.setItem("paymentMethod", paymentMethod)
    } catch {
      // ignore storage errors
    }
  }, [paymentMethod])

  const currencyCode =
    cart.currencyCode ?? cart.lines[0]?.variant?.currencyCode ?? "AED"

  const checkoutUrlWithPayment = useMemo(() => {
    if (!cart.checkoutUrl) return ""
    if (!cart.checkoutUrl.startsWith("http")) return cart.checkoutUrl

    try {
      const url = new URL(cart.checkoutUrl)
      // Shopify may ignore this, but it can be consumed by custom checkout/cart logic.
      url.searchParams.set("payment", paymentMethod === "cod" ? "cash_on_delivery" : "online")
      url.searchParams.set(
        "payment_method",
        paymentMethod === "cod" ? "cash_on_delivery" : "online"
      )
      return url.toString()
    } catch {
      return cart.checkoutUrl
    }
  }, [cart.checkoutUrl, paymentMethod])

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
                          <span className="absolute top-1 left-1 z-10 rounded bg-[#0A1931] text-white text-[10px] font-semibold uppercase px-1.5 py-0.5 shadow-[0_0_8px_rgba(74,127,167,0.5),0_0_16px_rgba(10,25,49,0.4)]">
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
                            <p className="font-bold text-red-600 dark:text-red-400">
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
                          <p className="font-bold text-red-600 dark:text-red-400">
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
                <TrustBadges variant="compact" showShopifyBadge={true} />
                <CartSummary cart={cart} />

                <div className="space-y-3 pt-2">
                  <p className="text-sm font-semibold tracking-wide">Payment method</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={cn(
                        "px-3 py-3 rounded-lg border transition-colors text-left",
                        paymentMethod === "cod"
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border hover:border-gold/60 hover:bg-gold/5"
                      )}
                      role="radio"
                      aria-checked={paymentMethod === "cod"}
                    >
                      <div className="flex items-start gap-2">
                        <Banknote className="h-4 w-4 mt-0.5" aria-hidden />
                        <div>
                          <div className="text-sm font-semibold">Cash on Delivery</div>
                          <div className="text-xs text-muted-foreground">Pay at delivery</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={cn(
                        "px-3 py-3 rounded-lg border transition-colors text-left",
                        paymentMethod === "online"
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border hover:border-gold/60 hover:bg-gold/5"
                      )}
                      role="radio"
                      aria-checked={paymentMethod === "online"}
                    >
                      <div className="flex items-start gap-2">
                        <CreditCard className="h-4 w-4 mt-0.5" aria-hidden />
                        <div>
                          <div className="text-sm font-semibold">Online Payment</div>
                          <div className="text-xs text-muted-foreground">Secure checkout</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (checkoutUrlWithPayment) window.location.href = checkoutUrlWithPayment
                  }}
                  disabled={isLoading || !checkoutUrlWithPayment}
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
