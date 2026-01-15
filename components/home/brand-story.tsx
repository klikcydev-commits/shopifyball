"use client"

import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Gem, Shield, Zap } from "lucide-react"

const pillars = [
  {
    icon: Gem,
    title: "Crafted Materials",
    description: "Premium cotton blends, durable zippers, soft-touch finishes. Every detail considered.",
  },
  {
    icon: Shield,
    title: "Elite Comfort",
    description: "Engineered for the long match day. From tunnel walk to final whistle.",
  },
  {
    icon: Zap,
    title: "Match-Day Energy",
    description: "Accessories that carry the weight of the moment. Ready when you are.",
  },
]

export function BrandStory() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main statement */}
        <div
          className={cn(
            "max-w-3xl mx-auto text-center mb-20 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">The Brand</span>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-balance">
            "LEMAH is built around the ritual —
            <span className="text-gold"> the walk to the pitch, the light, the silence before noise.</span>"
          </blockquote>
        </div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={cn(
                "text-center transition-all duration-700",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: isRevealed ? `${(index + 1) * 150}ms` : "0ms" }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
                <pillar.icon className="h-7 w-7 text-gold" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>

              {/* Tactical line accent */}
              <div className="mt-6 flex justify-center">
                <div className="w-12 h-px bg-gold/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
