"use client"

import { useState, type FormEvent } from "react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function ContactNewsletter() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
    }
  }

  return (
    <section ref={ref} className="py-16 bg-secondary/50 border-t border-border">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={cn(
            "transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <h3 className="text-xl font-semibold mb-2">Stay in the loop</h3>
          <p className="text-sm text-muted-foreground mb-6">Get updates on new drops and exclusive offers.</p>

          {isSubmitted ? (
            <p className="text-gold font-medium animate-in fade-in zoom-in duration-300">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-navy-light transition-colors btn-press"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
