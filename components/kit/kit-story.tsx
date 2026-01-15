"use client"

import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function KitStory() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">The Story</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8">
            Why <span className="text-gold">Eleven</span>?
          </h2>

          <div className="space-y-6 text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            <p>
              Eleven players on the pitch. Eleven essential accessories for your match day. It's not coincidence — it's
              design intent.
            </p>
            <p>
              We studied how fans and players prepare for match day. The bag packed the night before. The lucky charm
              tucked in the pocket. The socks laid out like ritual. Every item carries meaning.
            </p>
            <p>
              The 11Kit takes this ritual and elevates it. A curated system where every piece has a position, every
              accessory has purpose. Like a formation, each item supports the others to create something greater than
              the sum of parts.
            </p>
          </div>

          {/* Visual divider */}
          <div
            className={cn(
              "mt-12 flex justify-center gap-2 transition-all duration-700",
              isRevealed ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDelay: "300ms" }}
          >
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gold"
                style={{
                  opacity: 0.3 + (i / 10) * 0.7,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
