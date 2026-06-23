import { event } from "@/lib/fpixel"
import type { Cart, Product, ProductVariant } from "@/lib/shopify-types"

/** Extract numeric Shopify ID from a GID for Meta content_ids. */
export function toMetaContentId(id: string): string {
  const last = id.split("/").pop()
  return last ?? id
}

export function trackViewContent(params: {
  productId: string
  productName: string
  value: number
  currency: string
}) {
  return event("ViewContent", {
    content_ids: [toMetaContentId(params.productId)],
    content_name: params.productName,
    content_type: "product",
    value: params.value,
    currency: params.currency,
  })
}

export function trackAddToCart(params: {
  productId: string
  productName: string
  variantId: string
  value: number
  currency: string
  quantity: number
}) {
  return event("AddToCart", {
    content_ids: [toMetaContentId(params.variantId)],
    content_name: params.productName,
    content_type: "product",
    value: params.value,
    currency: params.currency,
    num_items: params.quantity,
  })
}

export function trackAddToCartFromProduct(
  product: Product,
  variant: ProductVariant,
  quantity = 1
) {
  return trackAddToCart({
    productId: product.id,
    productName: product.title,
    variantId: variant.id,
    value: Number.parseFloat(variant.price) * quantity,
    currency: variant.currencyCode ?? product.currencyCode ?? "AED",
    quantity,
  })
}

export function trackInitiateCheckout(cart: Cart) {
  const currency =
    cart.currencyCode ?? cart.lines[0]?.variant.currencyCode ?? "AED"

  return event("InitiateCheckout", {
    content_ids: cart.lines.map((line) => toMetaContentId(line.variant.id)),
    content_type: "product",
    value: Number.parseFloat(cart.totalAmount || cart.subtotal || "0"),
    currency,
    num_items: cart.totalQuantity,
  })
}

export function trackSearch(searchString: string) {
  const trimmed = searchString.trim()
  if (!trimmed) return null
  return event("Search", { search_string: trimmed })
}

export function trackContact(email?: string) {
  return event(
    "Contact",
    {},
    email ? { userData: { email } } : {}
  )
}

export function trackLead(email?: string) {
  return event(
    "Lead",
    { content_name: "Contact Form" },
    email ? { userData: { email } } : {}
  )
}

export function trackCompleteRegistration(email?: string) {
  return event(
    "CompleteRegistration",
    { content_name: "Newsletter" },
    email ? { userData: { email } } : {}
  )
}
