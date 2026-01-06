'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { toast } from 'sonner'

interface ProductCardProps {
  product: ShopifyProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()
  
  const image = product.images?.edges?.[0]?.node
  const price = product.priceRange.minVariantPrice
  const variant = product.variants?.edges?.[0]?.node
  const isAvailable = variant?.availableForSale

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!variant?.id || !isAvailable) return
    
    setIsAdding(true)
    try {
      await addItem(variant.id, 1)
      toast.success(`${product.title} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group bg-background rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-primary-foreground font-medium uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading text-lg mb-2 group-hover:text-gold transition-colors">
            {product.title}
          </h3>
          <p className="text-gold font-medium text-lg mb-4">
            {price.amount} {price.currencyCode}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <Button
          variant="navy"
          size="sm"
          className="w-full"
          disabled={!isAvailable || isAdding}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ShoppingBag className="w-4 h-4 mr-2" />
          )}
          {isAdding ? 'Adding...' : isAvailable ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </div>
    </div>
  )
}
