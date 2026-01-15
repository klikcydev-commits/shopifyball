"use client"

import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Ruler, Wind, Sparkles, Briefcase, Palette } from "lucide-react"

const principles = [
  {
    icon: Ruler,
    title: "Precision Materials",
    description:
      "Every fabric, zipper, and stitch is selected for durability and feel. We source premium materials that perform under pressure and age beautifully.",
  },
  {
    icon: Wind,
    title: "Comfort Under Pressure",
    description:
      "Whether it's a 90-minute match or a full travel day, our accessories are designed for sustained comfort. Breathable, lightweight, supportive.",
  },
  {
    icon: Sparkles,
    title: "Minimal, Loud Energy",
    description:
      "Clean designs that make a statement. We strip away the unnecessary to let quality speak. Premium doesn't need to shout.",
  },
  {
    icon: Briefcase,
    title: "Travel-Ready Systems",
    description:
      "Organization is freedom. Our bags and organizers are built with compartments that make sense, closures that work, and sizes that fit life.",
  },
  {
    icon: Palette,
    title: "Gold Details",
    description:
      "Our signature gold accents aren't decoration — they're a mark of quality. Used sparingly, like jewelry, to highlight what matters.",
  },
]

export function DesignPrinciples() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            "text-center max-w-2xl mx-auto mb-16 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Design Philosophy</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">What We Stand For</h2>
          <p className="text-muted-foreground text-lg">Five principles guide everything we create. No compromises.</p>
        </div>

        {/* Principles grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {principles.map((principle, index) => (
            <div
              key={principle.title}
              className={cn(
                "group p-8 bg-background rounded-xl border border-border hover:border-gold/40 transition-all duration-500 card-hover",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                // Make last item span full width on md screens if odd number
                index === principles.length - 1 && principles.length % 2 !== 0 && "md:col-span-2 lg:col-span-1",
              )}
              style={{ transitionDelay: isRevealed ? `${index * 100}ms` : "0ms" }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                <principle.icon className="h-6 w-6 text-gold" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-gold transition-colors">{principle.title}</h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{principle.description}</p>

              {/* Gold accent line */}
              <div className="mt-6 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
