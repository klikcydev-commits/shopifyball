"use client"

import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Leaf } from "lucide-react"

export function Sustainability() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background" id="sustainability">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={cn(
            "transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-8">
            <Leaf className="h-7 w-7 text-gold" />
          </div>

          {/* Header */}
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Responsibility</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Buy fewer.
            <br />
            <span className="text-gold">Buy better.</span>
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            We don't chase trends or push fast fashion. LEMAH accessories are built to last for seasons — years, even.
            Quality over quantity. Keep what you love. Use it until it tells stories.
          </p>

          {/* Commitments */}
          <div className="flex flex-wrap justify-center gap-4">
            {["Durable materials", "Minimal packaging", "Timeless design", "Repair-friendly"].map((item, index) => (
              <span
                key={item}
                className={cn(
                  "px-4 py-2 border border-gold/30 rounded-full text-sm text-gold transition-all duration-500",
                  isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                )}
                style={{ transitionDelay: isRevealed ? `${(index + 1) * 100}ms` : "0ms" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
