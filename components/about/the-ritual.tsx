"use client"

import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function TheRitual() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">The Ritual</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Every match day has a rhythm.</h2>
        </div>

        {/* Content blocks */}
        <div className="space-y-12">
          <div
            className={cn(
              "relative pl-8 border-l-2 border-gold/30 transition-all duration-700",
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gold" />
            <h3 className="text-xl font-semibold mb-3 text-gold">The Preparation</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Hours before kickoff, the ritual begins. Each item in its place. You get ready your way — head in the game. The moment you keep starts here.
            </p>
          </div>

          <div
            className={cn(
              "relative pl-8 border-l-2 border-gold/30 transition-all duration-700",
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gold" />
            <h3 className="text-xl font-semibold mb-3 text-gold">The Journey</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              The walk to the stadium. The drive as the lights turn on. You show up ready. What you take home is the moment — and that&apos;s what we build for.
            </p>
          </div>

          <div
            className={cn(
              "relative pl-8 border-l-2 border-gold/30 transition-all duration-700",
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
            style={{ transitionDelay: "450ms" }}
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gold" />
            <h3 className="text-xl font-semibold mb-3 text-gold">The Moment</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Stadium lights. The roar. Your scarf in the air. What you carry got you here — and the moment you keep lives on in our collectible frames: CR7, Mbappé, Ronaldo & Messi legends. The game, frozen in time.
            </p>
          </div>
        </div>

        {/* Tactical divider */}
        <div
          className={cn(
            "mt-16 flex justify-center transition-all duration-700",
            isRevealed ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDelay: "600ms" }}
        >
          <svg width="200" height="40" viewBox="0 0 200 40" className="text-gold/30">
            <line x1="0" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="120" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </section>
  )
}
