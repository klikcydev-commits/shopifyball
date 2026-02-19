"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const PRODUCT_FAQ = [
  {
    q: "Do you ship this product to Dubai and the UAE?",
    a: "Yes. We deliver across Dubai and the UAE. Your order will be processed and shipped to your address.",
  },
  {
    q: "Is this a good football gift for a teen or boy?",
    a: "Many of our products are popular as football gifts for teens and boys — ideal for birthdays, match day, or football room decor. Check our football gifts for teens Dubai collection for more ideas.",
  },
  {
    q: "Can I use this as football wall art or bedroom decor?",
    a: "Yes. Our frames and wall art are designed for display in bedrooms, offices, or game rooms. They make great football room decor in Dubai and the UAE.",
  },
  {
    q: "Is the product gift-ready?",
    a: "We offer gift-ready packaging so you can send directly to a football fan. Perfect for surprises in Dubai and the UAE.",
  },
]

export function ProductFaq() {
  return (
    <div className="mt-10 pt-8 border-t border-border">
      <h2 className="text-lg font-bold tracking-tight mb-4">Product FAQ — Dubai & UAE</h2>
      <Accordion type="single" collapsible className="w-full">
        {PRODUCT_FAQ.map((item, i) => (
          <AccordionItem key={i} value={`product-faq-${i}`}>
            <AccordionTrigger className="text-left text-sm">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
