"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { FloatingParticles } from "@/components/animations/floating-particles"
import { TacticalLines } from "@/components/animations/tactical-lines"

const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      {/* Background: hero image + optional video */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          aria-hidden
        />
        {HERO_VIDEO_URL ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : null}
        {/* Gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-navy-light/90" />
      </div>

      {/* Background layers */}
      <div className="absolute inset-0 z-[1]">
        {/* Tactical lines */}
        <TacticalLines />

        {/* Floating particles */}
        <FloatingParticles count={30} />

        {/* Spotlight sweep effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-gold/5 to-transparent animate-spotlight" />
        </div>

        {/* Subtle stadium lighting gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gold/10 blur-[150px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        {/* Eyebrow */}
        <div className="mb-6 animate-stagger-in" style={{ animationDelay: "0.1s" }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/30 rounded-full text-xs uppercase tracking-[0.2em] text-gold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Premium Football Accessories
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary-foreground tracking-tighter mb-6">
          <span className="block animate-stagger-in" style={{ animationDelay: "0.2s" }}>
            ELEVEN
          </span>
          <span className="block animate-stagger-in text-gold" style={{ animationDelay: "0.4s" }}>
            READY.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="max-w-xl mx-auto text-lg md:text-xl text-primary-foreground/70 mb-10 animate-stagger-in leading-relaxed"
          style={{ animationDelay: "0.6s" }}
        >
          Accessories for the ritual. Stadium-to-street essentials crafted for those who live the game.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-stagger-in"
          style={{ animationDelay: "0.8s" }}
        >
          <Link
            href="/11kit"
            className="group flex items-center gap-2 px-8 py-4 bg-gold text-primary font-medium uppercase tracking-wider hover:bg-gold-light transition-all btn-press gold-glow"
          >
            Explore 11Kit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#products"
            className="flex items-center gap-2 px-8 py-4 border border-primary-foreground/30 text-primary-foreground font-medium uppercase tracking-wider hover:bg-primary-foreground/10 transition-colors btn-press"
          >
            Shop Accessories
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-gold rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
