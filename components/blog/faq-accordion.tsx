'use client'

import { useState } from 'react'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  title?: string
}

/**
 * Accessible FAQ accordion: one item open at a time.
 */
export function FAQAccordion({ items, title = 'Frequently asked questions' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const list = Array.isArray(items) ? items : []

  return (
    <section className="faq-accordion not-prose" aria-label={title}>
      <h2 className="text-xl font-semibold text-foreground mb-5">{title}</h2>
      <div className="space-y-2">
        {list.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left font-medium text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                <span>{item.question}</span>
                <span
                  className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className={`border-t border-border ${isOpen ? 'block' : 'hidden'}`}
              >
                <div className="px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
