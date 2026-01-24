"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { collections } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function FeaturedCollections() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

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
          <p className="text-muted-foreground text-lg">Three distinct aesthetics. One elevated standard.</p>
        </div>

        {/* Collections */}
        <div className="space-y-16 md:space-y-24">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={cn(
                "grid md:grid-cols-2 gap-8 md:gap-16 items-center transition-all duration-700",
                index % 2 === 1 && "md:flex-row-reverse",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
              )}
              style={{ transitionDelay: isRevealed ? `${index * 200}ms` : "0ms" }}
            >
              {/* 3D Card */}
              <Link
                href={`/#${collection.handle}`}
                className={cn(
                  "group card-3d relative aspect-[4/5] rounded-lg flex items-end justify-center pb-8 px-8",
                  index % 2 === 1 && "md:order-2",
                )}
              >
                <div className="card-wrapper absolute inset-0 transition-all duration-500 z-0 rounded-lg overflow-hidden">
                  <Image
                    src="/collection-cover.jpg"
                    alt={collection.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Hover character image */}
                <div className="card-character-wrapper absolute inset-0 z-2 pointer-events-none overflow-visible">
                  <Image
                    src="/collection-hover.png"
                    alt={collection.title}
                    width={600}
                    height={800}
                    className="card-character"
                  />
                </div>
                
                <div className="card-title relative z-10 text-center transition-transform duration-500">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{collection.title}</h3>
                  <span className="text-sm text-white/80 uppercase tracking-wider">
                    {collection.products.length} Products
                  </span>
                </div>
              </Link>

              {/* Content */}
              <div className={cn(index % 2 === 1 && "md:order-1")}>
                <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Collection 0{index + 1}</span>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{collection.title}</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{collection.description}</p>
                <Link
                  href={`/#${collection.handle}`}
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
