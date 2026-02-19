// Headless Shopify Types
export interface Product {
  id: string
  title: string
  handle: string
  description: string
  images: ProductImage[]
  price: string
  currencyCode?: string
  compareAtPrice?: string
  tags: string[]
  variants: ProductVariant[]
  availableForSale: boolean
  category?: string
  /** Collection IDs (GIDs) for matching Admin API discounts by collection */
  collectionIds?: string[]
}

export interface ProductImage {
  id: string
  url: string
  altText: string
  width: number
  height: number
}

export interface ProductVariant {
  id: string
  title: string
  price: string
  currencyCode?: string
  compareAtPrice?: string
  availableForSale: boolean
  selectedOptions: { name: string; value: string }[]
}

export interface Collection {
  id: string
  title: string
  handle: string
  description: string
  image?: ProductImage
  products: Product[]
}

export interface CartLine {
  id: string
  quantity: number
  product: Product
  variant: ProductVariant
  /** Line total from Shopify (after line-level discounts). Use for display to match checkout. */
  lineTotal?: string
  /** Compare-at price per unit from Shopify (for sale display in cart). */
  compareAtPrice?: string | null
}

export interface CartDiscountCode {
  code: string
  applicable: boolean
}

export interface Cart {
  id: string
  lines: CartLine[]
  totalQuantity: number
  /** Subtotal from Shopify cost.subtotalAmount (before cart-level discounts). */
  subtotal: string
  /** Total from Shopify cost.totalAmount (after discounts; matches checkout). */
  totalAmount?: string
  currencyCode?: string
  checkoutUrl: string
  /** Discount codes applied to cart (from Shopify). */
  discountCodes?: CartDiscountCode[]
  /** Total discount amount from Shopify discountAllocations. */
  discountAmount?: string
  /** Tax amount from Shopify if available; otherwise "Calculated at checkout". */
  totalTaxAmount?: string | null
}

// 11Kit Types
export interface KitSlot {
  id: string
  position: string
  category: string
  product?: Product
  x: number
  y: number
}

export interface KitStyle {
  id: string
  name: string
  description: string
  colorScheme: "white" | "navy" | "gold"
  products: Product[]
}
