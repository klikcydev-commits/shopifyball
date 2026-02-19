"use client"

import Link from "next/link"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@/lib/utils"
import { ArrowRight, Gift, Shirt, LayoutGrid } from "lucide-react"

const SECTIONS = [
  {
    id: "dubai",
    label: "Dubai & UAE",
    title: "Football Gifts in Dubai",
    icon: Gift,
    description:
      "Premium accessories and collectible frames for football lovers. Gift-ready packaging, fast UAE delivery.",
    links: [
      { href: "/football-gifts-dubai", label: "Football gifts Dubai" },
      { href: "/football-gifts-uae", label: "Football gifts UAE" },
    ],
    cta: { href: "/football-gifts-dubai", label: "Explore gifts" },
  },
  {
    id: "players",
    label: "Player & Club",
    title: "Ronaldo, Messi & Real Madrid",
    icon: Shirt,
    description:
      "Collectible gifts and wall art celebrating the game's biggest names and clubs. CR7, Messi, Real Madrid and more.",
    links: [
      { href: "/ronaldo-gifts-dubai", label: "Ronaldo gifts" },
      { href: "/messi-gifts-dubai", label: "Messi gifts" },
    ],
    cta: { href: "/shop", label: "View collection" },
  },
  {
    id: "room",
    label: "Room & Match Day",
    title: "Wall Art & Room Decor",
    icon: LayoutGrid,
    description:
      "Frames and wall art that stand out — perfect for bedrooms and offices. Ideal for fans and collectors, with UAE delivery.",
    links: [
      { href: "/football-gifts-for-teens-dubai", label: "Gifts for young fans" },
      { href: "/shop", label: "Full shop" },
    ],
    cta: { href: "/shop", label: "Shop now" },
  },
]

export function HomeSeoSections() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-28 bg-muted/50" id="seo-sections">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {SECTIONS.map((block, index) => {
              const Icon = block.icon
              return (
                <div
                  key={block.id}
                  className={cn(
                    "group relative flex flex-col p-6 md:p-8 rounded-xl border border-border bg-background",
                    "transition-all duration-300 ease-out",
                    "hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-0.5",
                  )}
                  style={{
                    transitionDelay: isRevealed ? `${index * 80}ms` : "0ms",
                  }}
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-gold mb-3 block">
                    {block.label}
                  </span>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-gold transition-colors group-hover:bg-gold/10">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                      {block.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {block.description}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                    {block.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-xs font-medium text-muted-foreground hover:text-gold underline underline-offset-2 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={block.cta.href}
                    className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gold hover:gap-3 transition-all w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded"
                  >
                    {block.cta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
