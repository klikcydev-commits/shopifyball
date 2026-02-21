'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { adaptShopifyProduct } from '@/lib/shopify/adapter'
import { ProductCard } from '@/components/products/product-card'

interface ShopProductsClientProps {
  products: ShopifyProduct[]
}

export function AllProductsClient({ products }: ShopProductsClientProps) {
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
        <ProductCardWithAnimation
          key={product.id}
          product={product}
          index={index}
        />
      ))}
    </div>
  )
}

interface ProductCardWithAnimationProps {
  product: ShopifyProduct
  index: number
}

function ProductCardWithAnimation({ product, index }: ProductCardWithAnimationProps) {
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
      <ProductCard product={adaptedProduct} />
    </motion.div>
  )
}
