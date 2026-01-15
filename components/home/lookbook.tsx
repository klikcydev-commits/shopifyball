"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { SectionHeader } from "@/components/ui/section-header"

const lookbookImages = [
  { id: 1, src: "/premium-football-accessories-white-minimal-stadium.jpg", caption: "Pre-match ritual" },
  { id: 2, src: "/grip-socks-close-up-texture-white-minimal.jpg", caption: "Details matter" },
  { id: 3, src: "/premium-duffel-bag-navy-gold-zipper-minimal.jpg", caption: "Carry systems" },
  { id: 4, src: "/football-tunnel-walk-accessories-minimal.jpg", caption: "Tunnel ready" },
  { id: 5, src: "/premium-water-bottle-stadium-lights-minimal.jpg", caption: "Hydration" },
  { id: 6, src: "/premium-cap-headwear-white-gold-minimal.jpg", caption: "Street style" },
  { id: 7, src: "/football-scarf-waving-stadium-minimal.jpg", caption: "Match day energy" },
  { id: 8, src: "/premium-travel-organizer-accessories-minimal.jpg", caption: "Organization" },
  { id: 9, src: "/football-accessories-collection-flatlay-minimal.jpg", caption: "The collection" },
]

export function Lookbook() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <SectionHeader
            eyebrow="Lookbook"
            title="Moments"
            subtitle="Stadium lights. Street walks. Match day rituals."
          />
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {lookbookImages.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "group relative overflow-hidden rounded-lg transition-all duration-700",
                // Varying heights for masonry effect
                index % 3 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: isRevealed ? `${index * 75}ms` : "0ms" }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.caption}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-sm font-medium">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
