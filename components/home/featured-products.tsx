import { Suspense } from 'react'
import { getProducts } from '@/lib/shopify'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export async function FeaturedProducts() {
  const { products } = await getProducts({ first: 6 })

  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-navy/10 rounded-full text-navy text-sm font-medium uppercase tracking-wider mb-4">
            Featured Products
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-4">
            SHOP THE <span className="text-gold">BEST</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium football gear trusted by professional athletes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="navy" size="lg" asChild>
            <Link href="/search">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}


