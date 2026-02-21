"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function AboutCta() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-secondary/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={cn(
            "transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Start Your Ritual</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Your eleven.
            <br />
            <span className="text-gold">Your carry.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Shop collectible frames UAE — CR7, Mbappé, Ronaldo & Messi. Football gifts Dubai. UAE delivery, gift-ready packaging.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gold text-primary font-medium uppercase tracking-wider hover:bg-gold/90 transition-all btn-press gold-glow"
            >
              Shop Collectible Frames
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-gold text-gold font-medium uppercase tracking-wider hover:bg-gold hover:text-primary transition-all"
            >
              Football Gifts Dubai & UAE
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
