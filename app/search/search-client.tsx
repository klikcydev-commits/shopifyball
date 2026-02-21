'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAllProductsAction, getAllCollectionProductsAction } from '@/app/actions/product-actions'
import type { ShopifyCollection, ShopifyProduct } from '@/lib/shopify/types'
import type { Product } from '@/lib/shopify-types'
import { adaptShopifyProduct } from '@/lib/shopify/adapter'
import { ProductTile } from '@/components/products/product-tile'
import { FilterList } from '@/components/search/filter-list'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-context'
import { useToast } from '@/hooks/use-toast'

interface SearchClientProps {
  collectionHandle?: string
  query?: string
  collections: ShopifyCollection[]
}

export function SearchClient({ collectionHandle, query, collections }: SearchClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
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

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      setLoadError(null)
      try {
        if (collectionHandle) {
          const result = await getAllCollectionProductsAction(collectionHandle)
          setProducts(result.products)
          if (result.error) setLoadError(result.error)
        } else {
          const result = await getAllProductsAction(query ? { query } : undefined)
          setProducts(result.products)
          if (result.error) setLoadError(result.error)
        }
      } catch (error) {
        console.error('Error loading products:', error)
        setLoadError(error instanceof Error ? error.message : 'Failed to load products')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [collectionHandle, query])

  const handleCollectionChange = (handle: string | null) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (handle) {
        params.set('collection', handle)
        params.delete('q')
      } else {
        params.delete('collection')
      }
      router.push(`/search?${params.toString()}`)
    })
  }

  const handleSearch = (searchQuery: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery) {
        params.set('q', searchQuery)
        params.delete('collection')
      } else {
        params.delete('q')
      }
      router.push(`/search?${params.toString()}`)
    })
  }

  return (
    <div className="section-padding bg-cream pb-20 md:pb-24">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterList
              collections={collections}
              selectedCollection={collectionHandle || null}
              onCollectionChange={handleCollectionChange}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-8 text-center">
              <h1 className="font-heading text-4xl md:text-5xl text-navy mb-4">
                {collectionHandle
                  ? collections.find((c) => c.handle === collectionHandle)?.title || 'Collection'
                  : query
                    ? `Search: ${query}`
                    : 'All Products'}
              </h1>
              {products.length > 0 && (
                <p className="text-muted-foreground">{products.length} products found</p>
              )}
            </div>

            {loadError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 mb-6 text-sm text-destructive">
                {loadError}
              </div>
            )}
            {isLoading || isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">No products found</p>
                <Button variant="default" onClick={() => handleCollectionChange(null)}>
                  View All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const adapted = adaptShopifyProduct(product)
                  return (
                    <ProductTile
                      key={product.id}
                      product={adapted}
                      aspect="square"
                      variant="light"
                      onAddToCart={handleAddToCart}
                      isAdding={addingId === adapted.id}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

