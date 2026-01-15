"use client"
import Image from "next/image"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"
import { cn } from "@/lib/utils"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity } = useCart()

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
                        €{(Number.parseFloat(line.variant.price) * line.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-secondary/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-semibold">€{cart.subtotal}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Shipping calculated at checkout</p>
                <button 
                  onClick={() => {
                    // Redirect to shop.lemah.store for checkout
                    const items = cart.lines.map(line => ({
                      variantId: line.variant.id,
                      quantity: line.quantity,
                    }))
                    const checkoutUrl = items.length > 0 
                      ? `https://shop.lemah.store/cart/${items.map(item => `${item.variantId}:${item.quantity}`).join(',')}`
                      : 'https://shop.lemah.store/cart'
                    window.location.href = checkoutUrl
                  }}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-navy-light transition-colors btn-press gold-glow"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
