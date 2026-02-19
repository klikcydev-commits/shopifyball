"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@/lib/utils"

const HOME_FAQ = [
  {
    q: "Where can I buy football gifts in Dubai?",
    a: "You can shop football gifts in Dubai and across the UAE right here at Lemah. We offer premium accessories, collectible frames, and wall art with fast UAE delivery. Browse our football gifts Dubai and football gifts UAE collections for the best picks.",
  },
  {
    q: "Do you deliver football gifts to the UAE?",
    a: "Yes. We deliver across Dubai and the UAE. Orders are processed and shipped so your football gifts reach you in time for birthdays, match day, or any occasion.",
  },
  {
    q: "What are the best football gifts for teens in Dubai?",
    a: "Teens and boys in Dubai love our collectible frames, wall art, and premium football accessories. They make ideal football bedroom decor and unique gifts. See our dedicated football gifts for teens Dubai collection for curated options.",
  },
  {
    q: "Do you have Ronaldo or Messi gifts in Dubai?",
    a: "Yes. We stock Ronaldo and Messi themed gifts and collectibles suitable for football fans in Dubai and the UAE. Check our Ronaldo gifts Dubai and Messi gifts Dubai landing pages for current selections.",
  },
  {
    q: "Are your football frames good for wall art in Dubai?",
    a: "Our frames are designed as premium football wall art. They work great for football room decor in Dubai and the UAE — in bedrooms, offices, or game rooms. Many designs change with viewing angle for a unique look.",
  },
  {
    q: "Is Lemah a football shop or football store in the UAE?",
    a: "Lemah is a premium football accessories and gifts store for Dubai and the UAE. We focus on quality collectibles, wall art, and gifts for football lovers — not just gear, but pieces that fans and teens love to display.",
  },
]

export function HomeFaq() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      className={cn(
        "py-20 md:py-28 bg-background transition-all duration-700",
        isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      )}
      id="faq"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs uppercase tracking-[0.2em] text-gold mb-2 block">FAQ</span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
          Football Gifts Dubai & UAE — Common Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {HOME_FAQ.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-8 text-sm text-muted-foreground">
          More options:{" "}
          <Link href="/football-gifts-dubai" className="font-medium text-foreground underline underline-offset-2">
            Football gifts Dubai
          </Link>
          ,{" "}
          <Link href="/football-gifts-for-teens-dubai" className="font-medium text-foreground underline underline-offset-2">
            gifts for teens
          </Link>
          ,{" "}
          <Link href="/shop" className="font-medium text-foreground underline underline-offset-2">
            full shop
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
