import { Suspense } from 'react'
import { getCollections } from '@/lib/shopify'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export async function FeaturedCategories() {
  let collections: Awaited<ReturnType<typeof getCollections>> = []
  
  try {
    collections = await getCollections(6)
  } catch (error) {
    console.error('Error fetching featured categories:', error)
    // Return empty state if API fails
  }

  if (collections.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-navy/10 rounded-full text-navy text-sm font-medium uppercase tracking-wider mb-4">
            Shop by Category
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            EXPLORE <span className="text-gold">COLLECTIONS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/search?collection=${collection.handle}`}
              className="group relative overflow-hidden rounded-2xl bg-muted aspect-square hover:shadow-lg transition-all duration-300"
            >
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent flex items-end p-6">
                <div>
                  <h3 className="font-heading text-2xl text-primary-foreground mb-2 group-hover:text-gold transition-colors">
                    {collection.title}
                  </h3>
                  <Button variant="heroOutline" size="sm">
                    Shop Collection
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


