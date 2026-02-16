import type { ShopifyCart } from './types'
import type { Cart, CartLine, Product, ProductVariant, ProductImage } from '@/lib/shopify-types'

/**
 * Convert Storefront API cart to UI Cart shape so existing components keep working.
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
      availableForSale: true,
      selectedOptions: m.selectedOptions ?? [],
    }
    return {
      id: node.id,
      quantity: node.quantity,
      product,
      variant,
    }
  })

  const totalQuantity = shopifyCart.totalQuantity ?? lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = shopifyCart.cost?.subtotalAmount?.amount ?? '0.00'
  const totalAmount = shopifyCart.cost?.totalAmount?.amount ?? subtotal
  const currencyCode = shopifyCart.cost?.subtotalAmount?.currencyCode ?? shopifyCart.cost?.totalAmount?.currencyCode

  const discountAllocations = shopifyCart.discountAllocations ?? []
  const discountAmount = discountAllocations
    .reduce((sum, a) => sum + Number.parseFloat(a.discountedAmount?.amount ?? '0'), 0)
    .toFixed(2)
  const discountCode = shopifyCart.discountCodes?.find((c) => c.applicable)?.code

  return {
    id: shopifyCart.id,
    lines,
    totalQuantity,
    subtotal,
    totalAmount,
    currencyCode,
    checkoutUrl: shopifyCart.checkoutUrl ?? '',
    discountCode: discountCode ?? undefined,
    discountAmount: Number(discountAmount) > 0 ? discountAmount : undefined,
  }
}
