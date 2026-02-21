"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function OriginStory() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div
            className={cn(
              "relative aspect-[4/5] rounded-xl overflow-hidden transition-all duration-700",
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12",
            )}
          >
            <Image
              src="/origin-story-tunnel.png"
              alt="Stadium tunnel walk"
              fill
              className="object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

            {/* Quote overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <blockquote className="text-white text-xl md:text-2xl font-light italic">
                &quot;The tunnel is where the game becomes real.&quot;
              </blockquote>
            </div>
          </div>

          {/* Content */}
          <div
            className={cn(
              "transition-all duration-700",
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12",
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Origin Story</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Football is identity.
              <br />
              <span className="text-gold">We built for that.</span>
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                For us, football is ritual, belonging, discipline. Match day isn&apos;t just a game — it&apos;s who we are. We looked for premium football gifts Dubai and UAE fans could love: collectible frames that feel special. Too much was cheap or covered in loud logos.
              </p>
              <p>
                We wanted pieces that matched the culture. Premium quality without the noise. So we built LEMAH: collectible frames (CR7, Mbappé, Ronaldo & Messi legends) that respect the ritual. The frame isn&apos;t just decor — it&apos;s the moment you keep. More football accessories coming soon.
              </p>
              <p>
                Today we deliver across Dubai and the UAE with gift-ready packaging. For fans who know the details matter. Who pack with intention. Who live the game.
              </p>
            </div>

            {/* Soft stat - only 11 is real */}
            <div className="mt-10 pt-10 border-t border-border">
              <p className="text-muted-foreground text-sm">
                Our 11Kit system — eleven essential items, one curated carry — is how we think about building your match day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
