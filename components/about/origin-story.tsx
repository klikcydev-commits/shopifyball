"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function OriginStory() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div
            className={cn(
              "relative aspect-[4/5] rounded-xl overflow-hidden transition-all duration-700",
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12",
            )}
          >
            <Image
              src="/stadium-tunnel-walk-minimal-cinematic.jpg"
              alt="Stadium tunnel walk"
              fill
              className="object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

            {/* Quote overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <blockquote className="text-white text-xl md:text-2xl font-light italic">
                "Where the light hits different."
              </blockquote>
            </div>
          </div>

          {/* Content */}
          <div
            className={cn(
              "transition-all duration-700",
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12",
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Origin Story</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Born from the culture.
              <br />
              <span className="text-gold">Built for it.</span>
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                LEMAH started in the stands. Watching matches across Europe, we noticed something missing — accessories
                that matched the passion of the game. Everything felt either too cheap or too corporate.
              </p>
              <p>
                We wanted something different. Premium quality without the logos. Football culture without the
                licensing. Accessories that respect the ritual of match day, the journey to the stadium, the life
                between games.
              </p>
              <p>
                Today, LEMAH serves fans and players across 40+ countries. People who understand that the details
                matter. Who pack their bag with intention. Who carry the culture everywhere they go.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gold">40+</p>
                <p className="text-sm text-muted-foreground mt-1">Countries</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gold">50K+</p>
                <p className="text-sm text-muted-foreground mt-1">Fans served</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gold">11</p>
                <p className="text-sm text-muted-foreground mt-1">Essential items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
