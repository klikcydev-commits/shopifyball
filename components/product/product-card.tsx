import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

interface ProductCardProps {
  product: ShopifyProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.edges?.[0]?.node
  const price = product.priceRange.minVariantPrice
  const isAvailable = product.variants?.edges?.[0]?.node?.availableForSale

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
          <Button
            variant="navy"
            size="sm"
            className="w-full"
            disabled={!isAvailable}
            onClick={(e) => {
              e.preventDefault()
              // Add to cart logic will be handled in product page
            }}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {isAvailable ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </Link>
    </div>
  )
}


