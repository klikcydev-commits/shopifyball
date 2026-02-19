"use client"

import Link from "next/link"
import { FloatingParticles } from "@/components/animations/floating-particles"
import { TacticalLines } from "@/components/animations/tactical-lines"

export function KitComingSoon() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary" />
        <TacticalLines />
        <FloatingParticles count={20} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gold/15 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 border border-gold/40 rounded-full text-xs uppercase tracking-[0.2em] text-gold mb-8 block">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          Coming Soon
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground tracking-tight mb-6">
          Build Your Eleven
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
          A curated football accessory system for match day, travel, and street — eleven essential items, customized to your style. We&apos;re bringing this experience to Dubai and the UAE soon.
        </p>

        <p className="text-base text-primary-foreground/60 mb-12">
          In the meantime, shop our football gifts and accessories with fast UAE delivery.
        </p>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-primary font-medium uppercase tracking-wider hover:bg-gold/90 transition-colors"
        >
          Shop Football Gifts
        </Link>
      </div>
    </section>
  )
}
