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
}

export interface Cart {
  id: string
  lines: CartLine[]
  totalQuantity: number
  subtotal: string
  checkoutUrl: string
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
