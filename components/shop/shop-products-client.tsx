'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ShopifyProduct } from '@/lib/shopify/types'
import type { Product } from '@/lib/shopify-types'
import { adaptShopifyProduct } from '@/lib/shopify/adapter'
import { ProductTile } from '@/components/products/product-tile'
import { useCart } from '@/components/cart/cart-context'
import { useToast } from '@/hooks/use-toast'

interface ShopProductsClientProps {
  products: ShopifyProduct[]
}

export function AllProductsClient({ products }: ShopProductsClientProps) {
  const [addingId, setAddingId] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.variants?.length) {
      toast({ title: 'Error', description: 'No variants available.', variant: 'destructive' })
      return
    }
    const variant = product.variants.find((v) => v.availableForSale) ?? product.variants[0]
    if (!variant?.availableForSale) {
      toast({ title: 'Out of stock', description: 'This product is unavailable.', variant: 'destructive' })
      return
    }
    setAddingId(product.id)
    try {
      await addToCart(product, variant)
      toast({ title: 'Added to cart', description: product.title })
    } catch {
      toast({ title: 'Error', description: 'Failed to add to cart.', variant: 'destructive' })
    } finally {
      setAddingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground mb-4">
          No products found
        </p>
        <p className="text-muted-foreground">
          Products will appear here once they are added to your Shopify store.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductTileWithAnimation
          key={product.id}
          product={product}
          index={index}
          onAddToCart={handleAddToCart}
          isAdding={addingId}
        />
      ))}
    </div>
  )
}

interface ProductTileWithAnimationProps {
  product: ShopifyProduct
  index: number
  onAddToCart: (e: React.MouseEvent, product: Product) => void
  isAdding: string | null
}

function ProductTileWithAnimation({ product, index, onAddToCart, isAdding }: ProductTileWithAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px'
  })

  let adaptedProduct: ReturnType<typeof adaptShopifyProduct> | null = null
  try {
    adaptedProduct = adaptShopifyProduct(product)
  } catch (error) {
    console.error('Error adapting product:', product.id, error)
    return null
  }

  if (!adaptedProduct) return null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <ProductTile
        product={adaptedProduct}
        aspect="square"
        variant="light"
        onAddToCart={onAddToCart}
        isAdding={isAdding === adaptedProduct.id}
      />
    </motion.div>
  )
}
