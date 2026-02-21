import { formatPriceWithCurrency } from "./utils"

/**
 * Variant shape from Storefront API (nested price/compareAtPrice) or adapted (flat strings).
 */
export type VariantForSale = {
  price: string | { amount: string; currencyCode?: string }
  compareAtPrice?: string | { amount: string; currencyCode?: string } | null
  currencyCode?: string
}

/** Result of getSale(): single source of truth for sale logic (before/after pricing). */
export type SaleInfo =
  | { isSale: false }
  | { isSale: true; price: number; compare: number; percentOff: number }

/** Result of getCardPricing(): for product card / quick view before-after display. */
export type CardPricing =
  | { isSale: false; price: number; currencyCode: string }
  | { isSale: true; price: number; compare: number; currencyCode: string }

/**
 * Card pricing from variant (Storefront API: price.amount, compareAtPrice.amount).
 * Use on every product card. A product is ON SALE iff compareAtPrice exists and compareAtPrice.amount > price.amount.
 */
export function getCardPricing(variant: VariantForSale | null | undefined): CardPricing {
  const priceAmount =
    variant == null
      ? "0"
      : typeof variant.price === "object" && variant.price != null
        ? variant.price.amount
        : String(variant.price ?? "0")
  const compareAmount =
    variant?.compareAtPrice == null || variant.compareAtPrice === ""
      ? null
      : typeof variant.compareAtPrice === "object"
        ? variant.compareAtPrice.amount
        : String(variant.compareAtPrice)
  const currencyCode =
    (variant && typeof variant.price === "object" && variant.price?.currencyCode) ||
    variant?.currencyCode ||
    "AED"
  const price = Number(priceAmount)
  const compare = compareAmount != null && compareAmount !== "" ? Number(compareAmount) : null
  const isSale = compare !== null && !Number.isNaN(compare) && !Number.isNaN(price) && compare > price
  if (isSale) return { isSale: true, price, compare, currencyCode }
  return { isSale: false, price, currencyCode }
}

/**
 * Single source of truth: variant is on sale iff compareAtPrice exists and compare > price.
 * Accepts Storefront API shape (price.amount, compareAtPrice.amount) or adapted flat strings.
 */
export function getSale(variant: VariantForSale | null | undefined): SaleInfo {
  if (!variant?.compareAtPrice) return { isSale: false }
  const priceAmount =
    typeof variant.price === "object" && variant.price != null
      ? variant.price.amount
      : String(variant.price ?? "0")
  const compareAmount =
    typeof variant.compareAtPrice === "object"
      ? variant.compareAtPrice.amount
      : String(variant.compareAtPrice ?? "")
  if (compareAmount === "") return { isSale: false }
  const price = Number(priceAmount)
  const compare = Number(compareAmount)
  if (Number.isNaN(price) || Number.isNaN(compare) || compare <= price) return { isSale: false }
  const percentOff = Math.round(((compare - price) / compare) * 100)
  return { isSale: true, price, compare, percentOff }
}

/**
 * Normalize price amount and currency from either API or adapted variant.
 */
function getAmountAndCurrency(variant: VariantForSale): {
  priceAmount: string
  compareAtAmount: string | null
  currencyCode: string
} {
  const priceAmount =
    typeof variant.price === "object" && variant.price != null
      ? variant.price.amount
      : String(variant.price ?? "0")
  const compareAtAmount =
    variant.compareAtPrice == null || variant.compareAtPrice === ""
      ? null
      : typeof variant.compareAtPrice === "object"
        ? variant.compareAtPrice.amount
        : String(variant.compareAtPrice)
  const currencyCode =
    (typeof variant.price === "object" && variant.price?.currencyCode) ||
    variant.currencyCode ||
    "AED"
  return { priceAmount, compareAtAmount, currencyCode }
}

/**
 * Definition of "on sale" (variant-level ONLY):
 * compareAtPrice is present and its amount is greater than price amount.
 */
export function isVariantOnSale(variant: VariantForSale | null | undefined): boolean {
  return getSale(variant).isSale
}

/** Single source of truth for sale/discount display. Compare-at only; no checkout discount guessing. */
export interface SaleState {
  /** true when compareAtPrice > price (primary sale signal from Storefront API). */
  isOnSale: boolean
  /** @deprecated use isOnSale */
  onSale: boolean
  /** Display price (variant.price). */
  price: string
  /** Formatted price for display. */
  priceText: string
  /** Compare-at amount (raw) or null when not on sale. */
  compareAt: string | null
  /** Formatted compare-at for display. */
  compareAtText: string
  /** Save amount formatted. */
  saveAmountText: string
  /** Save percent as string (e.g. "25%"). */
  savePercentText: string
  /** Percent off (0–100). */
  percentOff: number
  currencyCode: string
}

/**
 * Sale UI helper. Uses getSale() for logic; adds formatted strings for display.
 * FINAL DISPLAY PRICE = variant.price only. ORIGINAL = variant.compareAtPrice when > price.
 */
export function getSaleState(variant: VariantForSale | null | undefined): SaleState {
  const fallback: SaleState = {
    isOnSale: false,
    onSale: false,
    price: "0",
    priceText: "",
    compareAt: null,
    compareAtText: "",
    saveAmountText: "",
    savePercentText: "",
    percentOff: 0,
    currencyCode: "AED",
  }
  if (!variant) return fallback

  const { currencyCode } = getAmountAndCurrency(variant)
  const priceAmount =
    typeof variant.price === "object" && variant.price != null
      ? variant.price.amount
      : String(variant.price ?? "0")
  const priceText = formatPriceWithCurrency(priceAmount, currencyCode)

  const sale = getSale(variant)
  if (!sale.isSale) {
    return { ...fallback, price: priceAmount, priceText, currencyCode }
  }

  const compareAtAmount = String(sale.compare)
  const compareAtText = formatPriceWithCurrency(compareAtAmount, currencyCode)
  const saveAmount = (sale.compare - sale.price).toFixed(2)
  const saveAmountText = formatPriceWithCurrency(saveAmount, currencyCode)
  const savePercentText = `${sale.percentOff}%`

  return {
    isOnSale: true,
    onSale: true,
    price: String(sale.price),
    priceText,
    compareAt: compareAtAmount,
    compareAtText,
    saveAmountText,
    savePercentText,
    percentOff: sale.percentOff,
    currencyCode,
  }
}
