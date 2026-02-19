"use client"

import { FloatingParticles } from "@/components/animations/floating-particles"

export function AboutHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-primary">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-navy-light" />
        <FloatingParticles count={20} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gold/10 blur-[150px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        {/* Eyebrow */}
        <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-6 animate-stagger-in">
          The Brand
        </span>

        {/* Manifesto */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-tight leading-tight mb-8 animate-stagger-in"
          style={{ animationDelay: "0.2s" }}
        >
          Built for the
          <br />
          <span className="text-gold">eleven.</span>
        </h1>

        {/* Three lines of manifesto */}
        <div
          className="space-y-2 text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto animate-stagger-in"
          style={{ animationDelay: "0.4s" }}
        >
          <p>We carry what matters.</p>
          <p>We prepare like champions.</p>
          <p>We live the ritual.</p>
        </div>

        <p
          className="mt-6 text-base md:text-lg text-primary-foreground/60 max-w-xl mx-auto animate-stagger-in"
          style={{ animationDelay: "0.5s" }}
        >
          Premium football accessories and collectible gifts. UAE delivery, gift-ready packaging — for fans in Dubai and across the UAE.
        </p>

        {/* Decorative line */}
        <div className="mt-12 flex justify-center animate-stagger-in" style={{ animationDelay: "0.6s" }}>
          <div className="w-px h-20 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </div>
    </section>
  )
}
