"use client"
import Image from "next/image"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"
import { cn, formatPrice } from "@/lib/utils"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, isLoading } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 shadow-2xl transition-transform duration-500 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold tracking-wide uppercase">Your Cart</h2>
            <button onClick={onClose} className="p-2 hover:text-gold transition-colors" aria-label="Close cart">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          {cart.lines.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-6">Add some premium accessories to get started.</p>
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
                {cart.lines.map((line) => (
                  <div key={line.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={line.product.images[0]?.url || "/placeholder.svg"}
                        alt={line.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1 truncate">{line.product.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{line.variant.title}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-border rounded">
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            className="p-1.5 hover:bg-secondary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-sm">{line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
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
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice((Number.parseFloat(line.variant.price) * line.quantity).toString(), line.variant.currencyCode || line.product.currencyCode || "EUR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-secondary/50 space-y-4">
                {Number(cart.discountAmount ?? 0) > 0 && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Discount applied: {cart.discountCode} (−{formatPrice(cart.discountAmount!, cart.currencyCode ?? "AED")})
                    </p>
                    <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-0.5">
                      Total savings: {formatPrice(cart.discountAmount!, cart.currencyCode ?? "AED")}
                    </p>
                  </div>
                )}

                <div
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    cart.totalQuantity >= 2
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-amber-500/10 border-amber-500/30"
                  )}
                >
                  {cart.totalQuantity >= 2 ? (
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Free delivery unlocked
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                        Add {2 - cart.totalQuantity} more item{2 - cart.totalQuantity > 1 ? "s" : ""} for free delivery
                      </p>
                      <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                        Free shipping on orders with 2+ items
                      </p>
                    </>
                  )}
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(cart.subtotal, cart.currencyCode ?? cart.lines[0]?.variant?.currencyCode ?? "EUR")}</span>
                  </div>
                  {Number(cart.discountAmount ?? 0) > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Discount{cart.discountCode ? ` (${cart.discountCode})` : ""}</span>
                      <span>−{formatPrice(cart.discountAmount!, cart.currencyCode ?? "EUR")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{cart.totalQuantity >= 2 ? "FREE" : "Calculated at checkout"}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border font-semibold">
                    <span>Total</span>
                    <span>
                      {formatPrice(cart.totalAmount ?? cart.subtotal, cart.currencyCode ?? cart.lines[0]?.variant?.currencyCode ?? "EUR")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (cart.checkoutUrl) window.location.href = cart.checkoutUrl
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
