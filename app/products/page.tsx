import { Suspense } from 'react'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getProducts } from '@/lib/shopify'
// ProductCard is now used via AllProductsClient
import { AllProductsClient } from './all-products-client'
import type { Metadata } from 'next'
import { getPageMetadata } from '@/lib/seo/build-metadata'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = getPageMetadata('/products')

export default async function AllProductsPage() {
  // Fetch all products from Shopify
  let products: Awaited<ReturnType<typeof getProducts>>['products'] = []
  
  try {
    const result = await getProducts({ 
      first: 100 // Get up to 100 products
    })
    products = result.products
  } catch (error) {
    console.error('Error fetching products:', error)
    // Continue with empty products array
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src="/hero/143e766fa898a0c6d2b3306e6f0399a1.jpg"
              alt="All Products"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy/90" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-custom text-center">
              <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
                Complete Collection
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-primary-foreground mb-4">
                All Products
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
                Discover our complete range of premium football gear. From training essentials to game day champions.
              </p>
            </div>
          </div>
        </section>
        
        {/* Products Section with Scroll Animations */}
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-navy mb-4">
                Our Complete Collection
              </h2>
              {products.length > 0 && (
                <p className="text-muted-foreground text-lg">
                  {products.length} {products.length === 1 ? 'product' : 'products'} available
                </p>
              )}
            </div>

            <Suspense 
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              }
            >
              <AllProductsClient products={products} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


