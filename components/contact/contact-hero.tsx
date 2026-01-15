"use client"

import { FloatingParticles } from "@/components/animations/floating-particles"

export function ContactHero() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-primary">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-navy-light" />
        <FloatingParticles count={15} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-gold/10 blur-[120px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-6 animate-stagger-in">
          Contact
        </span>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground tracking-tight mb-6 animate-stagger-in"
          style={{ animationDelay: "0.2s" }}
        >
          We respond <span className="text-gold">fast.</span>
        </h1>

        <p
          className="text-lg text-primary-foreground/70 max-w-xl mx-auto animate-stagger-in"
          style={{ animationDelay: "0.4s" }}
        >
          Questions about orders, products, or collaborations? We're here to help. Reach out and expect a reply within
          24 hours.
        </p>
      </div>
    </section>
  )
}
