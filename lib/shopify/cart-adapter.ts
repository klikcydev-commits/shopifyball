import type { ShopifyCart } from './types'
import type { Cart, CartLine, CartDiscountCode, Product, ProductVariant, ProductImage } from '@/lib/shopify-types'

/**
 * Convert Storefront API cart to UI Cart shape.
 * All pricing and discount values come from Shopify (cost, discountAllocations, line.cost).
 * We do NOT recalculate totals or apply any discount locally. Cart totals = Shopify Cart API only.
 */
export function shopifyCartToCart(shopifyCart: ShopifyCart): Cart {
  const lines: CartLine[] = (shopifyCart.lines?.edges ?? []).map(({ node }) => {
    const m = node.merchandise
    const product: Product = {
      id: m.product.id,
      title: m.product.title,
      handle: m.product.handle,
      description: '',
      images: (m.product.images?.edges ?? []).map((img) => ({
        id: img.node.url,
        url: img.node.url,
        altText: img.node.altText ?? m.product.title,
        width: 600,
        height: 600,
      })) as ProductImage[],
      price: m.price.amount,
      currencyCode: m.price.currencyCode,
      tags: [],
      variants: [],
      availableForSale: true,
    }
    const variant: ProductVariant = {
      id: m.id,
      title: m.title,
      price: m.price.amount,
      currencyCode: m.price.currencyCode,
      compareAtPrice: m.compareAtPrice?.amount ?? undefined,
      availableForSale: true,
      selectedOptions: m.selectedOptions ?? [],
    }
    const lineTotal = node.cost?.totalAmount?.amount
    return {
      id: node.id,
      quantity: node.quantity,
      product,
      variant,
      lineTotal: lineTotal ?? (Number.parseFloat(m.price.amount) * node.quantity).toFixed(2),
      compareAtPrice: m.compareAtPrice?.amount ?? undefined,
    }
  })

  const totalQuantity =
    shopifyCart.totalQuantity ?? lines.reduce((sum, line) => sum + line.quantity, 0)
  const currencyCode =
    shopifyCart.cost?.subtotalAmount?.currencyCode ??
    shopifyCart.cost?.totalAmount?.currencyCode ??
    'AED'

  const subtotal = shopifyCart.cost?.subtotalAmount?.amount ?? '0.00'
  const totalAmount = shopifyCart.cost?.totalAmount?.amount ?? subtotal
  const discountAllocations = shopifyCart.discountAllocations ?? []
  const discountAmount = discountAllocations
    .reduce((sum, a) => sum + Number.parseFloat(a.discountedAmount.amount), 0)
    .toFixed(2)
  const subtotalNum = Number.parseFloat(subtotal)
  const totalNum = Number.parseFloat(totalAmount)
  const savingsAmount = subtotalNum > totalNum ? (subtotalNum - totalNum).toFixed(2) : undefined
  const deliveryEdges = shopifyCart.deliveryGroups?.edges ?? []
  const hasFreeShippingOption = deliveryEdges.some(({ node }) =>
    (node?.deliveryOptions ?? []).some((opt: { estimatedCost?: { amount?: string } }) =>
      Number.parseFloat(opt?.estimatedCost?.amount ?? '1') === 0
    )
  )
  const discountCodes: CartDiscountCode[] = (shopifyCart.discountCodes ?? []).map((d) => ({
    code: d.code,
    applicable: d.applicable,
  }))
  const totalTaxAmount =
    shopifyCart.cost?.totalTaxAmount?.amount != null && shopifyCart.cost.totalTaxAmount.amount !== ''
      ? shopifyCart.cost.totalTaxAmount.amount
      : null

  return {
    id: shopifyCart.id,
    lines,
    totalQuantity,
    subtotal,
    totalAmount,
    currencyCode,
    checkoutUrl: shopifyCart.checkoutUrl ?? '',
    discountCodes: discountCodes.length > 0 ? discountCodes : undefined,
    discountAmount: Number.parseFloat(discountAmount) > 0 ? discountAmount : undefined,
    savingsAmount,
    hasFreeShippingOption: hasFreeShippingOption || undefined,
    totalTaxAmount: totalTaxAmount ?? undefined,
  }
}
