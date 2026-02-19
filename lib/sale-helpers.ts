import { formatPriceWithCurrency } from "./utils"

/**
 * Variant shape from Storefront API (nested price/compareAtPrice) or adapted (flat strings).
 */
export type VariantForSale = {
  price: string | { amount: string; currencyCode?: string }
  compareAtPrice?: string | { amount: string; currencyCode?: string } | null
  currencyCode?: string
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
  if (!variant) return false
  const { priceAmount, compareAtAmount } = getAmountAndCurrency(variant)
  if (compareAtAmount == null || compareAtAmount === "") return false
  const compareNum = Number(compareAtAmount)
  const priceNum = Number(priceAmount)
  return !Number.isNaN(compareNum) && !Number.isNaN(priceNum) && compareNum > priceNum
}

export interface SaleState {
  onSale: boolean
  priceText: string
  compareAtText: string
  saveAmountText: string
  savePercentText: string
  currencyCode: string
}

/**
 * Sale UI helper. NEVER applies or computes any discount.
 * FINAL DISPLAY PRICE = variant.price only. ORIGINAL (optional) = variant.compareAtPrice when > price.
 * We only format and derive labels (save amount/percent for display). No manual or automatic discount math.
 */
export function getSaleState(variant: VariantForSale | null | undefined): SaleState {
  const fallback: SaleState = {
    onSale: false,
    priceText: "",
    compareAtText: "",
    saveAmountText: "",
    savePercentText: "",
    currencyCode: "AED",
  }
  if (!variant) return fallback

  const { priceAmount, compareAtAmount, currencyCode } = getAmountAndCurrency(variant)
  const priceNum = Number(priceAmount)
  const compareNum =
    compareAtAmount != null && compareAtAmount !== ""
      ? Number(compareAtAmount)
      : NaN

  const onSale =
    !Number.isNaN(compareNum) &&
    !Number.isNaN(priceNum) &&
    compareNum > 0 &&
    compareNum > priceNum

  const priceText = formatPriceWithCurrency(priceAmount, currencyCode)

  if (!onSale) {
    return {
      ...fallback,
      priceText,
      currencyCode,
    }
  }

  const compareAtText = formatPriceWithCurrency(compareAtAmount!, currencyCode)
  const saveAmount = (compareNum - priceNum).toFixed(2)
  const savePercent =
    compareNum > 0 ? Math.round((Number(saveAmount) / compareNum) * 100) : 0
  const saveAmountText = formatPriceWithCurrency(saveAmount, currencyCode)
  const savePercentText = `${savePercent}%`

  return {
    onSale: true,
    priceText,
    compareAtText,
    saveAmountText,
    savePercentText,
    currencyCode,
  }
}
