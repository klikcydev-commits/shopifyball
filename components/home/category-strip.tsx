"use client"
import Link from "next/link"
import { Briefcase, Gem, GlassWater, Shirt, Package, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const categories = [
  { name: "Socks & Grip", icon: Shirt, href: "#socks", description: "Performance meets style" },
  { name: "Bags & Carry", icon: Briefcase, href: "#bags", description: "Travel-ready systems" },
  { name: "Headwear", icon: Crown, href: "#headwear", description: "Cap, beanie, headband" },
  { name: "Match Day Kits", icon: Package, href: "#kits", description: "Curated essentials" },
  { name: "Bottles & Essentials", icon: GlassWater, href: "#essentials", description: "Hydration & carry" },
  { name: "Collectibles", icon: Gem, href: "#collectibles", description: "Limited pieces" },
]

export function CategoryStrip() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-16 md:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-3 block">Categories</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shop by Category</h2>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className={cn(
                "group relative p-6 bg-secondary rounded-lg text-center transition-all duration-500 card-hover",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: isRevealed ? `${index * 100}ms` : "0ms" }}
            >
              {/* Icon */}
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                <category.icon className="h-5 w-5" />
              </div>

              {/* Name */}
              <h3 className="font-medium text-sm mb-1 group-hover:text-gold transition-colors">{category.name}</h3>

              {/* Description */}
              <p className="text-xs text-muted-foreground">{category.description}</p>

              {/* Gold accent line on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-12" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
