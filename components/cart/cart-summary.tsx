"use client"

import type { Cart } from "@/lib/shopify-types"
import { formatPriceWithCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface CartSummaryProps {
  cart: Cart
  className?: string
  /** Show shipping as "Calculated at checkout" when true (default). */
  shippingLabel?: string
  /** Show taxes from cart or "Calculated at checkout". */
  taxesLabel?: string
}

/**
 * Displays cart cost breakdown from Shopify: Subtotal, Discounts, Shipping, Taxes, Total.
 * All amounts come from Storefront API cart cost / discountAllocations (no local calculation).
 */
export function CartSummary({
  cart,
  className,
  shippingLabel = "Calculated at checkout",
  taxesLabel,
}: CartSummaryProps) {
  const currencyCode = cart.currencyCode ?? cart.lines[0]?.variant?.currencyCode ?? "AED"
  const subtotal = cart.subtotal ?? "0.00"
  const total = cart.totalAmount ?? cart.subtotal ?? "0.00"
  const hasDiscount = cart.discountAmount != null && Number.parseFloat(cart.discountAmount) > 0
  const savingsAmount = cart.savingsAmount != null && Number.parseFloat(cart.savingsAmount) > 0 ? cart.savingsAmount : null
  const hasFreeShipping = cart.hasFreeShippingOption === true
  const taxesDisplay = taxesLabel ?? (cart.totalTaxAmount != null ? formatPriceWithCurrency(cart.totalTaxAmount, currencyCode) : "Calculated at checkout")

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatPriceWithCurrency(subtotal, currencyCode)}</span>
      </div>
      {hasDiscount && (
        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
          <span>Discounts applied</span>
          <span>-{formatPriceWithCurrency(cart.discountAmount!, currencyCode)}</span>
        </div>
      )}
      {savingsAmount && (
        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
          You save {formatPriceWithCurrency(savingsAmount, currencyCode)} on this order
        </p>
      )}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span className={cn(hasFreeShipping && "text-green-600 dark:text-green-400 font-medium")}>
          {hasFreeShipping ? "Free shipping" : shippingLabel}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Taxes</span>
        <span className="text-muted-foreground">{taxesDisplay}</span>
      </div>
      <div className="flex justify-between pt-2 border-t border-border font-semibold text-base">
        <span>Total</span>
        <span>{formatPriceWithCurrency(total, currencyCode)}</span>
      </div>
    </div>
  )
}
