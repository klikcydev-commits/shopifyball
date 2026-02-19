"use client"

import { cn, formatPriceWithCurrency } from "@/lib/utils"

export interface ProductPriceProps {
  /** Current selling price (variant.price) */
  price: string
  /** Original/compare-at price (variant.compareAtPrice). Only show sale UI when > price. */
  compareAtPrice?: string | null
  currencyCode?: string
  className?: string
  /** Show "Was $X" / "Now $Y" labels when on sale (default true) */
  showWasNow?: boolean
  /** Show "% OFF" badge when on sale */
  showPercentOff?: boolean
  /** Show "Save $Z (P%)" when on sale */
  showSavings?: boolean
  /** Size: affects font size of main price */
  size?: "sm" | "default" | "lg"
}

/**
 * Displays variant.price as the final price. No extra discount applied.
 * When variant.compareAtPrice > variant.price: shows compareAt (strikethrough), price (bold), Save X (Y%).
 * Otherwise shows price only. FINAL DISPLAY PRICE = price prop (always); never computed from discounts.
 */
export function ProductPrice({
  price,
  compareAtPrice,
  currencyCode = "AED",
  className,
  showWasNow = true,
  showPercentOff = true,
  showSavings = true,
  size = "default",
}: ProductPriceProps) {
  const priceNum = parseFloat(String(price))
  const compareNum =
    compareAtPrice != null && compareAtPrice !== ""
      ? parseFloat(String(compareAtPrice))
      : null
  const hasSale =
    compareNum != null &&
    !Number.isNaN(compareNum) &&
    compareNum > 0 &&
    !Number.isNaN(priceNum) &&
    compareNum > priceNum
  const percentOff =
    hasSale && compareNum > 0
      ? Math.round(((compareNum - priceNum) / compareNum) * 100)
      : 0
  const savingsAmount = hasSale ? (compareNum - priceNum).toFixed(2) : "0.00"

  if (hasSale) {
    return (
      <div className={cn("product-price flex flex-col gap-0.5", className)}>
        {showWasNow && (
          <span className="price-was text-sm text-zinc-500 dark:text-zinc-400 line-through">
            Was {formatPriceWithCurrency(String(compareNum), currencyCode)}
          </span>
        )}
        <span className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "price-now font-bold text-zinc-900 dark:text-zinc-100",
              size === "sm" && "text-lg",
              size === "default" && "text-xl",
              size === "lg" && "text-2xl"
            )}
          >
            {showWasNow ? "Now " : ""}
            {formatPriceWithCurrency(price, currencyCode)}
          </span>
          {showPercentOff && percentOff > 0 && (
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs font-medium px-2 py-0.5 rounded">
              {percentOff}% OFF
            </span>
          )}
        </span>
        {showSavings && percentOff > 0 && (
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            Save {formatPriceWithCurrency(savingsAmount, currencyCode)} ({percentOff}%)
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn("product-price", className)}>
      <span
        className={cn(
          "font-semibold text-zinc-900 dark:text-zinc-100",
          size === "sm" && "text-lg",
          size === "default" && "text-xl",
          size === "lg" && "text-2xl"
        )}
      >
        {formatPriceWithCurrency(price, currencyCode)}
      </span>
    </div>
  )
}
