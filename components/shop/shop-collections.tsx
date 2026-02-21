'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ShopifyCollection } from '@/lib/shopify/types'

interface ShopCollectionsProps {
  collections: ShopifyCollection[]
}

export function ShopCollections({ collections }: ShopCollectionsProps) {
  if (collections.length === 0) return null

  return (
    <section className="py-12 md:py-16 border-b border-border">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          Shop by collection
        </h2>
        <p className="text-muted-foreground">
          Browse by category to find what you need.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/search?collection=${encodeURIComponent(collection.handle)}`}
            className="group group/card relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground hover:border-gold/50 transition-colors"
          >
            <div className="relative aspect-[4/3] bg-muted">
              {collection.image?.url ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-muted-foreground">
                  <span className="text-4xl font-bold text-gold/40">
                    {collection.title.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 group-hover/card:text-gold transition-colors">
                {collection.title}
              </h3>
              {collection.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {collection.description}
                </p>
              )}
              <span className="inline-flex items-center gap-1 text-sm font-medium text-gold">
                View collection
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/card:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
