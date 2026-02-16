import type { ShopifyProduct } from './types'
import type { Product, ProductImage, ProductVariant } from '../shopify-types'

/**
 * Convert ShopifyProduct to Product type for new design components
 */
export function adaptShopifyProduct(shopifyProduct: ShopifyProduct): Product {
  // Debug: verify compare-at price from Storefront API (only in development)
  if (process.env.NODE_ENV === 'development') {
    const firstVariant = shopifyProduct.variants?.edges?.[0]?.node
    console.log('Product data:', {
      title: shopifyProduct.title,
      handle: shopifyProduct.handle,
      price: shopifyProduct.priceRange?.minVariantPrice?.amount,
      currencyCode: shopifyProduct.priceRange?.minVariantPrice?.currencyCode,
      compareAtPriceRange: shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount ?? null,
      variantCompareAt: firstVariant?.compareAtPrice?.amount ?? null,
    })
  }

  // Safely map images
  const images: ProductImage[] = (shopifyProduct.images?.edges || []).map(edge => ({
    id: edge.node.id,
    url: edge.node.url,
    altText: edge.node.altText || shopifyProduct.title,
    width: edge.node.width,
    height: edge.node.height,
  }))

  // Safely map variants with all price information including compareAtPrice for discounts
  const variants: ProductVariant[] = (shopifyProduct.variants?.edges || []).map(edge => ({
    id: edge.node.id,
    title: edge.node.title,
    price: edge.node.price?.amount || shopifyProduct.priceRange?.minVariantPrice?.amount || '0.00',
    currencyCode: edge.node.price?.currencyCode || shopifyProduct.priceRange?.minVariantPrice?.currencyCode || 'EUR',
    compareAtPrice: edge.node.compareAtPrice?.amount ?? undefined,
    availableForSale: edge.node.availableForSale || false,
    selectedOptions: edge.node.selectedOptions || [],
  }))

  // Extract tags from collections or use empty array
  const tags: string[] = (shopifyProduct.collections?.edges || []).map(edge => edge.node.handle) || []
  if (tags.includes('kit') || shopifyProduct.title?.toLowerCase().includes('kit')) {
    tags.push('11kit')
  }

  // Get price safely: selling price from priceRange, fallback to first variant (current price = what customer pays)
  const price =
    shopifyProduct.priceRange?.minVariantPrice?.amount ||
    variants[0]?.price ||
    '0.00'
  const currencyCode =
    shopifyProduct.priceRange?.minVariantPrice?.currencyCode ||
    variants[0]?.currencyCode ||
    'EUR'
  // Compare-at (original) price: from compareAtPriceRange or any variant where compare-at > selling price
  const rangeCompareAt = shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount
  const variantOnSale = variants.find(
    (v) => v.compareAtPrice && parseFloat(v.compareAtPrice!) > parseFloat(v.price)
  )
  const compareAtPrice =
    rangeCompareAt && parseFloat(rangeCompareAt) > parseFloat(price)
      ? rangeCompareAt
      : variantOnSale?.compareAtPrice

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title || 'Untitled Product',
    handle: shopifyProduct.handle || '',
    description: shopifyProduct.description || '',
    images: images.length > 0 ? images : [{ id: 'placeholder', url: '/placeholder.svg', altText: 'Product image', width: 600, height: 600 }],
    price,
    currencyCode,
    compareAtPrice,
    tags,
    variants: variants.length > 0 ? variants : [{
      id: 'default',
      title: 'Default',
      price,
      currencyCode,
      availableForSale: false,
      selectedOptions: [],
    }],
    availableForSale: variants.some(v => v.availableForSale),
    category: shopifyProduct.collections?.edges?.[0]?.node?.title,
  }
}
