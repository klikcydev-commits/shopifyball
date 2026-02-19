"use client"

import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const SHOP_FAQ = [
  {
    q: "Do you deliver football accessories to Dubai and the UAE?",
    a: "Yes. We deliver across Dubai and the UAE. Your order will be processed and shipped so you receive your football gifts and accessories in good time.",
  },
  {
    q: "What football gifts can I find in your shop?",
    a: "We stock premium football accessories, collectible frames, wall art, bags, and match day essentials. Ideal as gifts for football fans, teens, and boys. Browse our football gifts Dubai and football gifts UAE collections for curated picks.",
  },
  {
    q: "Do you have Ronaldo or Messi gifts?",
    a: "Yes. We have Ronaldo and Messi themed gifts and collectibles. See our Ronaldo gifts Dubai and Messi gifts Dubai pages for current selections, or filter in the shop.",
  },
  {
    q: "Is this a football shop or football store in the UAE?",
    a: "Lemah is a premium football gifts and accessories store for Dubai and the UAE. We focus on quality collectibles, wall art, and gifts for football lovers — perfect for gifting and football room decor.",
  },
]

export function ShopFaq() {
  return (
    <div className="mt-20 pt-16 border-t border-border">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Shop FAQ — Football Gifts Dubai & UAE</h2>
      <Accordion type="single" collapsible className="w-full max-w-3xl">
        {SHOP_FAQ.map((item, i) => (
          <AccordionItem key={i} value={`shop-faq-${i}`}>
            <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-6 text-sm text-muted-foreground">
        More:{" "}
        <Link href="/football-gifts-dubai" className="font-medium text-foreground underline underline-offset-2">
          Football gifts Dubai
        </Link>
        ,{" "}
        <Link href="/football-gifts-for-teens-dubai" className="font-medium text-foreground underline underline-offset-2">
          gifts for teens
        </Link>
        ,{" "}
        <Link href="/" className="font-medium text-foreground underline underline-offset-2">
          home
        </Link>
        .
      </p>
    </div>
  )
}
