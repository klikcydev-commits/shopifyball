import type { ShopifyProduct } from './types'
import type { Product, ProductImage, ProductVariant } from '../shopify-types'

/**
 * Convert ShopifyProduct to Product type for new design components
 */
export function adaptShopifyProduct(shopifyProduct: ShopifyProduct): Product {
  // Debug: verify compare-at price from Storefront API (only in development)
  if (process.env.NODE_ENV === 'development') {
    const firstVariant = shopifyProduct.variants?.edges?.[0]?.node
    const hasCompareAt = !!firstVariant?.compareAtPrice?.amount
    if (hasCompareAt) {
      console.log('🔍 [SALE PRODUCT]:', {
        title: shopifyProduct.title,
        handle: shopifyProduct.handle,
        price: shopifyProduct.priceRange?.minVariantPrice?.amount,
        currencyCode: shopifyProduct.priceRange?.minVariantPrice?.currencyCode,
        compareAtPriceRange: shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount ?? null,
        variantCompareAt: firstVariant?.compareAtPrice?.amount ?? null,
      })
    }
  }

  // Safely map images
  const images: ProductImage[] = (shopifyProduct.images?.edges || []).map(edge => ({
    id: edge.node.id,
    url: edge.node.url,
    altText: edge.node.altText || shopifyProduct.title,
    width: edge.node.width,
    height: edge.node.height,
  }))

  // Prefer variants.nodes (products list query) then edges (full variant detail)
  const variantNodes =
    shopifyProduct.variants?.nodes ??
    (shopifyProduct.variants?.edges || []).map((e) => e.node)
  const variants: ProductVariant[] = variantNodes.map((node) => ({
    id: node.id,
    title: String('title' in node ? node.title : 'Default'),
    price:
      node.price?.amount ||
      shopifyProduct.priceRange?.minVariantPrice?.amount ||
      '0.00',
    currencyCode:
      node.price?.currencyCode ||
      shopifyProduct.priceRange?.minVariantPrice?.currencyCode ||
      'AED',
    compareAtPrice: node.compareAtPrice?.amount ?? undefined,
    availableForSale: node.availableForSale ?? false,
    selectedOptions: ('selectedOptions' in node ? node.selectedOptions || [] : []) as { name: string; value: string }[],
  }))

  // Extract tags and collection IDs from collections
  const collectionEdges = shopifyProduct.collections?.edges || []
  const tags: string[] = collectionEdges.map(edge => edge.node.handle)
  if (tags.includes('kit') || shopifyProduct.title?.toLowerCase().includes('kit')) {
    tags.push('11kit')
  }
  const collectionIds: string[] = collectionEdges.map(edge => edge.node.id)

  // Get price safely: selling price from priceRange, fallback to first variant (current price = what customer pays)
  const price =
    shopifyProduct.priceRange?.minVariantPrice?.amount ||
    variants[0]?.price ||
    '0.00'
  const currencyCode =
    shopifyProduct.priceRange?.minVariantPrice?.currencyCode ||
    variants[0]?.currencyCode ||
    'AED'
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
    collectionIds: collectionIds.length > 0 ? collectionIds : undefined,
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
