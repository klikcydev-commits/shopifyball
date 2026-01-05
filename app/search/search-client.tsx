'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getCollectionAction, getProductsAction } from '@/app/actions/product-actions'
import type { ShopifyCollection, ShopifyProduct } from '@/lib/shopify/types'
import { ProductCard } from '@/components/product/product-card'
import { FilterList } from '@/components/search/filter-list'
import { Button } from '@/components/ui/button'

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
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      try {
        if (collectionHandle) {
          const collection = await getCollectionAction(collectionHandle, 24)
          if (collection) {
            setProducts(collection.products.edges.map((edge) => edge.node))
          }
        } else {
          const result = await getProductsAction({ query, first: 24 })
          setProducts(result.products)
        }
      } catch (error) {
        console.error('Error loading products:', error)
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
    <div className="section-padding bg-cream">
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
            <div className="mb-8">
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

            {isLoading || isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">No products found</p>
                <Button variant="navy" onClick={() => handleCollectionChange(null)}>
                  View All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

