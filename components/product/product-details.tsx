'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-provider'
import { ShoppingBag, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { buildProductUrl } from '@/lib/shopify/checkout'

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
  const { addItem } = useCart()

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
      await addItem(selectedVariant.id, quantity)
      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  const price = selectedVariant?.price || product.priceRange.minVariantPrice

  return (
    <div className="section-padding bg-cream">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
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
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={image.node.id}
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
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-navy mb-4">{product.title}</h1>
            <p className="text-gold text-3xl font-bold mb-6">
              {price.amount} {price.currencyCode}
            </p>

            <div
              className="prose prose-sm max-w-none mb-8 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

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
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-border rounded hover:bg-muted"
                >
                  −
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-border rounded hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              variant="navy"
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
          </div>
        </div>
      </div>
    </div>
  )
}



