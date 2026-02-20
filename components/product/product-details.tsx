'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { Button } from '@/components/ui/button'
import { ClientOnly } from '@/components/ui/client-only'
import { useCart } from '@/components/cart/cart-context'
import { adaptShopifyProduct } from '@/lib/shopify/adapter'
import type { ProductVariant } from '@/lib/shopify-types'
import { ShoppingBag, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { buildProductUrl } from '@/lib/shopify/checkout'
import { getSaleState } from '@/lib/sale-helpers'
import { ProductSeoBlock } from '@/components/product/product-seo-block'
import { ProductFaq } from '@/components/product/product-faq'

interface ProductDetailsProps {
  product: ShopifyProduct
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.edges[0]?.node || null
  )
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const images = product.images.edges
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value }
    setSelectedOptions(newOptions)

    // Find matching variant
    const matchingVariant = product.variants.edges.find(({ node: variant }) => {
      return variant.selectedOptions.every(
        (option) => newOptions[option.name] === option.value
      )
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    if (!selectedVariant.availableForSale) {
      toast.error('This variant is not available')
      return
    }

    setIsAdding(true)
    try {
      const adaptedProduct = adaptShopifyProduct(product)
      const matchingVariant = adaptedProduct.variants.find((v: ProductVariant) => v.id === selectedVariant.id)
      if (!matchingVariant) {
        toast.error('Variant not found')
        return
      }
      await addToCart(adaptedProduct, matchingVariant, quantity)
    } catch (error) {
      toast.error('Failed to add to cart')
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  // FINAL DISPLAY PRICE = variant.price only. No extra discount (Shopify price is already the selling price).
  const variantForSale = selectedVariant
    ? {
        price: selectedVariant.price,
        compareAtPrice: selectedVariant.compareAtPrice ?? undefined,
        currencyCode: selectedVariant.price?.currencyCode,
      }
    : null
  const saleState = getSaleState(variantForSale)

  return (
    <div className="section-padding bg-cream">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
              {saleState.onSale && (
                <span className="absolute top-4 left-4 z-10 rounded-md bg-red-600 text-white text-sm font-bold uppercase tracking-wider px-3 py-1.5 shadow-lg">
                  Sale
                </span>
              )}
              {images[selectedImageIndex] && (
                <Image
                  src={images[selectedImageIndex].node.url}
                  alt={images[selectedImageIndex].node.altText || product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
            {images.length > 1 && (
              <ClientOnly
                fallback={
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square rounded-lg bg-muted/50 animate-pulse" />
                    ))}
                  </div>
                }
              >
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={image.node.id}
                      type="button"
                      aria-label={`View image ${index + 1}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-gold'
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <Image
                        src={image.node.url}
                        alt={image.node.altText || product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12.5vw"
                      />
                    </button>
                  ))}
                </div>
              </ClientOnly>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-navy mb-4">{product.title}</h1>
            <div className="mb-6">
              {saleState.onSale ? (
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg text-zinc-500 dark:text-zinc-400 line-through">
                    <del>{saleState.compareAtText}</del>
                  </span>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {saleState.priceText}
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Save {saleState.saveAmountText} ({saleState.savePercentText})
                  </span>
                  {saleState.percentOff > 0 && (
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {saleState.percentOff}% OFF
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Sale pricing shown based on compare-at price.
                  </p>
                </div>
              ) : (
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {saleState.priceText}
                </span>
              )}
            </div>

            <div
              className="prose prose-sm max-w-none mb-8 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

            <ProductSeoBlock title={product.title} handle={product.handle} />
            <ProductFaq />

            <ClientOnly
              fallback={
                <div className="mb-6 space-y-6" style={{ minHeight: 280 }}>
                  <div className="h-16 bg-muted/30 rounded animate-pulse" />
                  <div className="h-14 bg-muted/30 rounded animate-pulse" />
                  <div className="h-12 bg-muted/30 rounded animate-pulse" />
                  <div className="h-12 bg-muted/30 rounded animate-pulse" />
                </div>
              }
            >
              {/* Options */}
              {product.options.map((option) => (
                <div key={option.id} className="mb-6">
                  <label className="block text-sm font-medium mb-2">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`px-4 py-2 rounded-md border-2 transition-all ${
                            isSelected
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-border hover:border-gold/50'
                          }`}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-border rounded hover:bg-muted"
                  >
                    −
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-border rounded hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                variant="default"
                size="lg"
                className="w-full mb-4"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale || isAdding}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {isAdding
                  ? 'Adding...'
                  : selectedVariant?.availableForSale
                    ? 'Add to Cart'
                    : 'Sold Out'}
              </Button>

              {/* Buy Now - Direct to shop.lemah.store */}
              {selectedVariant?.availableForSale && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mb-4"
                  onClick={() => {
                    window.location.href = buildProductUrl(product.handle)
                  }}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Buy Now on Shop
                </Button>
              )}

              {selectedVariant?.availableForSale && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  In stock and ready to ship
                </p>
              )}
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  )
}



