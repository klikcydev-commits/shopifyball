"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

// 11 positions in a 4-3-3 formation
const formation = [
  { id: 1, position: "GK", name: "Water Bottle", x: 50, y: 90 },
  { id: 2, position: "LB", name: "Grip Socks", x: 15, y: 70 },
  { id: 3, position: "CB", name: "Duffel Bag", x: 35, y: 70 },
  { id: 4, position: "CB", name: "Travel Organizer", x: 65, y: 70 },
  { id: 5, position: "RB", name: "Match Pouch", x: 85, y: 70 },
  { id: 6, position: "LM", name: "Headband", x: 20, y: 45 },
  { id: 7, position: "CM", name: "Wristbands", x: 50, y: 45 },
  { id: 8, position: "RM", name: "Cap", x: 80, y: 45 },
  { id: 9, position: "LW", name: "Phone Case", x: 20, y: 20 },
  { id: 10, position: "ST", name: "Scarf", x: 50, y: 15 },
  { id: 11, position: "RW", name: "Keychain", x: 80, y: 20 },
]

export function ElevenKitTeaser() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-20 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div
            className={cn(
              "transition-all duration-700",
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 border border-gold/30 rounded-full text-xs uppercase tracking-[0.2em] text-gold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Signature Experience
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Build Your
              <br />
              <span className="text-gold">Eleven.</span>
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 leading-relaxed max-w-lg">
              11Kit is your curated accessory system for match day, travel, and street. Eleven essential items, arranged
              like a formation, customized to your style.
            </p>
            <ul className="space-y-3 mb-10">
              {["Choose your kit style", "Select 11 curated accessories", "Customize each position"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-primary-foreground/80">
                  <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/11kit"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gold text-primary font-medium uppercase tracking-wider hover:bg-gold-light transition-all btn-press"
            >
              Build Your 11Kit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Formation visualization */}
          <div
            className={cn(
              "relative aspect-[4/5] transition-all duration-700",
              isRevealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12",
            )}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Pitch background */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-navy-light/50 to-primary/50 border border-gold/20">
              {/* Pitch lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Center line */}
                <line
                  x1="0"
                  y1="50"
                  x2="100"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-gold/30"
                />
                {/* Center circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-gold/30"
                />
                {/* Penalty areas */}
                <rect
                  x="25"
                  y="0"
                  width="50"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-gold/30"
                />
                <rect
                  x="25"
                  y="82"
                  width="50"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-gold/30"
                />
              </svg>
            </div>

            {/* Formation slots */}
            {formation.map((slot, index) => (
              <div
                key={slot.id}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                  hoveredSlot === slot.id ? "scale-125 z-10" : "scale-100",
                )}
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={() => setHoveredSlot(slot.id)}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                {/* Slot circle */}
                <div
                  className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all",
                    hoveredSlot === slot.id
                      ? "bg-gold text-primary shadow-lg shadow-gold/30"
                      : "bg-primary-foreground/10 border border-gold/40 text-gold",
                  )}
                >
                  <span className="text-xs font-bold">{slot.id}</span>
                </div>

                {/* Tooltip */}
                {hoveredSlot === slot.id && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-gold text-primary text-xs font-medium rounded shadow-lg animate-in fade-in zoom-in-95 duration-200">
                    {slot.name}
                  </div>
                )}
              </div>
            ))}

            {/* Progress indicator */}
            <div className="absolute bottom-4 left-4 right-4 bg-primary/80 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gold font-medium">Your 11Kit</span>
                <span className="text-primary-foreground/60">Hover to preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
