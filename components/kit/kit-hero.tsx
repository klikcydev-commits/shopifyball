"use client"

import { ArrowDown } from "lucide-react"
import { FloatingParticles } from "@/components/animations/floating-particles"
import { TacticalLines } from "@/components/animations/tactical-lines"

export function KitHero() {
  const scrollToBuilder = () => {
    document.getElementById("kit-builder")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary" />
        <TacticalLines />
        <FloatingParticles count={25} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gold/15 blur-[180px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="mb-8 animate-stagger-in">
          <span className="inline-flex items-center gap-2 px-4 py-2 border border-gold/40 rounded-full text-xs uppercase tracking-[0.2em] text-gold">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Signature Experience
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary-foreground tracking-tighter mb-6">
          <span className="block animate-stagger-in" style={{ animationDelay: "0.1s" }}>
            BUILD YOUR
          </span>
          <span className="block animate-stagger-in text-gold" style={{ animationDelay: "0.3s" }}>
            ELEVEN.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/70 mb-12 animate-stagger-in leading-relaxed"
          style={{ animationDelay: "0.5s" }}
        >
          A curated accessory system for match day, travel, and street. Eleven essential items, arranged like a
          formation, customized to your style.
        </p>

        {/* CTA */}
        <button
          onClick={scrollToBuilder}
          className="group inline-flex flex-col items-center gap-2 text-gold animate-stagger-in"
          style={{ animationDelay: "0.7s" }}
        >
          <span className="text-sm font-medium uppercase tracking-wider">Start Building</span>
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </button>

        {/* Formation preview watermark */}
        <div className="absolute bottom-0 left-0 right-0 h-48 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet">
            {/* 4-3-3 dots */}
            <circle cx="200" cy="90" r="4" fill="currentColor" className="text-gold" />
            <circle cx="100" cy="70" r="3" fill="currentColor" className="text-gold" />
            <circle cx="160" cy="70" r="3" fill="currentColor" className="text-gold" />
            <circle cx="240" cy="70" r="3" fill="currentColor" className="text-gold" />
            <circle cx="300" cy="70" r="3" fill="currentColor" className="text-gold" />
            <circle cx="120" cy="45" r="3" fill="currentColor" className="text-gold" />
            <circle cx="200" cy="45" r="3" fill="currentColor" className="text-gold" />
            <circle cx="280" cy="45" r="3" fill="currentColor" className="text-gold" />
            <circle cx="120" cy="20" r="3" fill="currentColor" className="text-gold" />
            <circle cx="200" cy="15" r="3" fill="currentColor" className="text-gold" />
            <circle cx="280" cy="20" r="3" fill="currentColor" className="text-gold" />
          </svg>
        </div>
      </div>
    </section>
  )
}
