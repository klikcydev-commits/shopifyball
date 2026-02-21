"use client"

import { Mail, Package, Users, Building } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const options = [
  {
    icon: Mail,
    title: "Email Support",
    description: "General questions and help",
    email: "hello@lemah.co",
  },
  {
    icon: Package,
    title: "Order Help",
    description: "Tracking and order support",
    email: "orders@lemah.co",
  },
  {
    icon: Users,
    title: "Collaborations",
    description: "Partnerships and creators",
    email: "collab@lemah.co",
  },
  {
    icon: Building,
    title: "Wholesale",
    description: "Business inquiries",
    email: "wholesale@lemah.co",
  },
]

export function ContactOptions() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-20 md:py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option, index) => (
            <a
              key={option.title}
              href={`mailto:${option.email}`}
              className={cn(
                "group p-6 bg-secondary rounded-xl text-center hover:bg-secondary/80 transition-all duration-500 card-hover",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: isRevealed ? `${index * 100}ms` : "0ms" }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background mb-4 group-hover:bg-gold/10 transition-colors">
                <option.icon className="h-5 w-5 text-gold" />
              </div>

              {/* Title */}
              <h3 className="font-semibold mb-1 group-hover:text-gold transition-colors">{option.title}</h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-3">{option.description}</p>

              {/* Email */}
              <p className="text-xs text-gold truncate">{option.email}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
