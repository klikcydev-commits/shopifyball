import type { ShopifyProduct } from './types'
import type { Product, ProductImage, ProductVariant } from '../shopify-types'

/**
 * Convert ShopifyProduct to Product type for new design components
 */
export function adaptShopifyProduct(shopifyProduct: ShopifyProduct): Product {
  // Safely map images
  const images: ProductImage[] = (shopifyProduct.images?.edges || []).map(edge => ({
    id: edge.node.id,
    url: edge.node.url,
    altText: edge.node.altText || shopifyProduct.title,
    width: edge.node.width,
    height: edge.node.height,
  }))

  // Safely map variants
  const variants: ProductVariant[] = (shopifyProduct.variants?.edges || []).map(edge => ({
    id: edge.node.id,
    title: edge.node.title,
    price: edge.node.price?.amount || '0.00',
    compareAtPrice: undefined, // Shopify doesn't always provide this in Storefront API
    availableForSale: edge.node.availableForSale || false,
    selectedOptions: edge.node.selectedOptions || [],
  }))

  // Extract tags from collections or use empty array
  const tags: string[] = (shopifyProduct.collections?.edges || []).map(edge => edge.node.handle) || []
  if (tags.includes('kit') || shopifyProduct.title?.toLowerCase().includes('kit')) {
    tags.push('11kit')
  }

  // Get price safely
  const price = shopifyProduct.priceRange?.minVariantPrice?.amount || '0.00'

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title || 'Untitled Product',
    handle: shopifyProduct.handle || '',
    description: shopifyProduct.description || '',
    images: images.length > 0 ? images : [{ id: 'placeholder', url: '/placeholder.svg', altText: 'Product image', width: 600, height: 600 }],
    price,
    compareAtPrice: undefined,
    tags,
    variants: variants.length > 0 ? variants : [{
      id: 'default',
      title: 'Default',
      price,
      availableForSale: false,
      selectedOptions: [],
    }],
    availableForSale: variants.some(v => v.availableForSale),
    category: shopifyProduct.collections?.edges?.[0]?.node?.title,
  }
}
