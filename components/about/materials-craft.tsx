"use client"

import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Check } from "lucide-react"

const materials = [
  { name: "Premium Cotton Blends", detail: "Breathable, soft, durable" },
  { name: "YKK Zippers", detail: "Smooth, reliable, gold-plated" },
  { name: "Soft-Touch Finishes", detail: "Matte textures that feel right" },
  { name: "Reinforced Stitching", detail: "Built to last seasons" },
  { name: "Stainless Steel Hardware", detail: "Resistant, weighted, premium" },
  { name: "Water-Resistant Coatings", detail: "Ready for any weather" },
]

export function MaterialsCraft() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div
            className={cn(
              "transition-all duration-700",
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Materials & Craft</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              What goes in.
              <br />
              <span className="text-gold">What comes out.</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-10">
              We obsess over materials because you feel the difference. Every component is chosen for performance,
              durability, and that premium touch you notice every time you use it.
            </p>

            {/* Materials list */}
            <div className="grid sm:grid-cols-2 gap-4">
              {materials.map((material, index) => (
                <div
                  key={material.name}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg bg-white/5 transition-all duration-500",
                    isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  )}
                  style={{ transitionDelay: isRevealed ? `${index * 75}ms` : "0ms" }}
                >
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{material.name}</p>
                    <p className="text-xs text-primary-foreground/50">{material.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual grid */}
          <div
            className={cn(
              "grid grid-cols-2 gap-4 transition-all duration-700",
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12",
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="space-y-4">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-gold/20 to-transparent p-6 flex items-end">
                <p className="text-xs uppercase tracking-wider text-gold">Cotton Blend</p>
              </div>
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-white/10 to-transparent p-6 flex items-end">
                <p className="text-xs uppercase tracking-wider text-primary-foreground/60">YKK Gold</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-white/5 to-transparent p-6 flex items-end">
                <p className="text-xs uppercase tracking-wider text-primary-foreground/60">Soft Touch</p>
              </div>
              <div className="aspect-square rounded-lg bg-gradient-to-br from-gold/10 to-transparent p-6 flex items-end">
                <p className="text-xs uppercase tracking-wider text-gold/80">Steel HW</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
