import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getProducts, getCollections } from '@/lib/shopify'
import { AllProductsClient } from '@/components/shop/shop-products-client'
import { ShopCollections } from '@/components/shop/shop-collections'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop | LeMah',
  description: 'Browse our complete collection of premium football accessories - everything you need from training to game day.',
}

export default async function ShopPage() {
  let products: Awaited<ReturnType<typeof getProducts>>['products'] = []
  let collections: Awaited<ReturnType<typeof getCollections>> = []
  let error: Error | null = null

  try {
    const [productsResult, collectionsResult] = await Promise.all([
      getProducts({ first: 100 }),
      getCollections(20),
    ])
    products = productsResult.products ?? []
    collections = collectionsResult ?? []
  } catch (err) {
    console.error('Error fetching shop data:', err)
    error = err instanceof Error ? err : new Error('Failed to fetch products')
    // Continue with empty arrays so page still renders
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden bg-primary">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-navy-light" />
            {/* Subtle stadium lighting gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gold/15 blur-[180px] rounded-full" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
            {/* Badge */}
            <div className="mb-8 animate-stagger-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 border border-gold/40 rounded-full text-xs uppercase tracking-[0.2em] text-gold">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                Complete Collection
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary-foreground tracking-tighter mb-6">
              <span className="block animate-stagger-in" style={{ animationDelay: "0.1s" }}>
                SHOP
              </span>
              <span className="block animate-stagger-in text-gold" style={{ animationDelay: "0.3s" }}>
                ALL PRODUCTS
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/70 mb-12 animate-stagger-in leading-relaxed"
              style={{ animationDelay: "0.5s" }}
            >
              Discover our complete range of premium football accessories. From training essentials to game day champions.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {collections.length > 0 && (
              <div className="mb-16">
                <ShopCollections collections={collections} />
              </div>
            )}
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Our Complete Collection
              </h2>
              {products.length > 0 && (
                <p className="text-muted-foreground text-lg">
                  {products.length} {products.length === 1 ? 'product' : 'products'} available
                </p>
              )}
            </div>

            {error ? (
              <div className="text-center py-16">
                <p className="text-xl text-destructive mb-4">
                  Error loading products
                </p>
                <p className="text-muted-foreground mb-6">
                  {error.message}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your Shopify configuration and try again.
                </p>
              </div>
            ) : (
              <AllProductsClient products={products} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
