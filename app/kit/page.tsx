import { Suspense } from 'react'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getProducts } from '@/lib/shopify'
import { ProductCard } from '@/components/product/product-card'
import type { Metadata } from 'next'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'The 11 Kit | LeMah',
  description: 'Discover our premium football kits - complete gear sets designed for champions. From jerseys to full team kits.',
}

export default async function KitPage() {
  // Fetch products with "kit" tag from Shopify
  let products: Awaited<ReturnType<typeof getProducts>>['products'] = []
  
  try {
    const result = await getProducts({ 
      query: 'tag:kit', // Filter products by "kit" tag
      first: 50 // Get up to 50 kit products
    })
    products = result.products
  } catch (error) {
    console.error('Error fetching kit products:', error)
    // Continue with empty products array
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src="/hero/ae7d957f2c45de5aaa5ed7cbb0356459.jpg"
              alt="The 11 Kit"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-navy/80" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-custom text-center">
              <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
                Premium Collection
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-4">
                The 11 Kit
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Complete football gear sets designed for champions. Premium quality kits for every player.
              </p>
            </div>
          </div>
        </section>
        
        {/* Products Section */}
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="font-heading text-3xl md:text-4xl text-navy mb-4">
                Complete Kit Collection
              </h2>
              {products.length > 0 && (
                <p className="text-muted-foreground">
                  {products.length} {products.length === 1 ? 'kit' : 'kits'} available
                </p>
              )}
            </div>

            <Suspense 
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              }
            >
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground mb-4">
                    No kit products found
                  </p>
                  <p className="text-muted-foreground">
                    Make sure you have products tagged with &quot;kit&quot; in your Shopify store.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

