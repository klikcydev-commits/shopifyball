"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const kitFaqs = [
  {
    id: 1,
    question: "Can I buy individual items instead of the full kit?",
    answer:
      "Yes! Every item in the 11Kit is also available individually. The kit builder is designed to help you curate a complete set, but you're free to add any combination to your cart.",
  },
  {
    id: 2,
    question: "What if I want to swap an item later?",
    answer:
      "No problem. Items are added separately to your cart, so you can remove or swap any product before checkout. For post-purchase changes, contact our support team.",
  },
  {
    id: 3,
    question: "Is there a discount for buying the full 11Kit?",
    answer:
      "We occasionally run promotions where completing your 11Kit unlocks special pricing. Join our newsletter to be first to know about kit deals.",
  },
  {
    id: 4,
    question: "Can I save my kit configuration?",
    answer:
      "Currently, your kit configuration is saved in your session. We're working on account features that will let you save and share your custom kits.",
  },
  {
    id: 5,
    question: "What's included with 11Kit gift packaging?",
    answer:
      "Premium gift packaging includes a custom LEMAH box with formation-style layout, tissue paper, ribbon closure, and a personalized note card. Available at checkout.",
  },
]

export function KitFaq() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section ref={ref} className="py-20 md:py-32 bg-secondary/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">11Kit Questions</h2>
        </div>

        <div className="space-y-3">
          {kitFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className={cn(
                "border border-border rounded-lg overflow-hidden transition-all duration-500",
                openIndex === index && "border-gold/40",
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: isRevealed ? `${index * 50}ms` : "0ms" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-gold flex-shrink-0 transition-transform duration-300",
                    openIndex === index && "rotate-180",
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96" : "max-h-0",
                )}
              >
                <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
