"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ShopifyCollection } from "@/lib/shopify/types"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

interface FeaturedCollectionsProps {
  collections: ShopifyCollection[]
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  if (collections.length === 0) return null

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background" id="collections">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className={cn(
            "max-w-xl mb-16 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-3 block">Collections</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">Curated for the Culture</h2>
          <p className="text-muted-foreground text-lg">Shop by collection — each link takes you to that collection.</p>
        </div>

        {/* Collections from Shopify */}
        <div className="space-y-12 md:space-y-20">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={cn(
                "grid md:grid-cols-2 gap-6 md:gap-12 items-center transition-all duration-700",
                index % 2 === 1 && "md:flex-row-reverse",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
              )}
              style={{ transitionDelay: isRevealed ? `${index * 200}ms` : "0ms" }}
            >
              {/* 3D Card - constrained size for mobile/laptop */}
              <div className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[320px] mx-auto md:mx-0">
                <Link
                  href={`/search?collection=${encodeURIComponent(collection.handle)}`}
                  className={cn(
                    "group card-3d relative aspect-[4/5] rounded-lg flex items-end justify-center pb-6 px-4 block w-full",
                    index % 2 === 1 && "md:order-2",
                  )}
                >
                  <div className="card-wrapper absolute inset-0 transition-all duration-500 z-0 rounded-lg overflow-hidden">
                    <Image
                      src={collection.image?.url ?? "/collection-cover.jpg"}
                      alt={collection.image?.altText ?? collection.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 220px, 320px"
                    />
                  </div>
                  {/* Dark overlay on image - stronger on hover */}
                  <div
                    className="absolute inset-0 z-[1] rounded-lg pointer-events-none bg-black/40 transition-all duration-500 group-hover:bg-black/80"
                    aria-hidden
                  />
                  {/* Hover character image */}
                  <div className="card-character-wrapper absolute inset-0 z-2 pointer-events-none overflow-visible">
                    <Image
                      src="/collection-hover.png"
                      alt=""
                      width={600}
                      height={800}
                      className="card-character"
                      aria-hidden
                    />
                  </div>
                </Link>
              </div>

              {/* Content - collection title and link */}
              <div className={cn(index % 2 === 1 && "md:order-1")}>
                <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">
                  Collection
                </span>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{collection.title}</h3>
                {collection.description && (
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed line-clamp-3">
                    {collection.description}
                  </p>
                )}
                <Link
                  href={`/search?collection=${encodeURIComponent(collection.handle)}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider hover:text-gold transition-colors"
                >
                  Browse Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
