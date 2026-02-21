"use client"

import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { ShopifyProduct } from "@/lib/shopify/types"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import { ProductCard } from "@/components/products/product-card"

export interface LandingFaqItem {
  q: string
  a: string
}

interface LandingPageTemplateProps {
  title: string
  introContent: React.ReactNode
  faq: LandingFaqItem[]
  products: ShopifyProduct[]
  internalLinks: { label: string; href: string }[]
}

export function LandingPageTemplate({
  title,
  introContent,
  faq,
  products,
  internalLinks,
}: LandingPageTemplateProps) {
  const adaptedProducts = products
    .map((p) => {
      try {
        return adaptShopifyProduct(p)
      } catch {
        return null
      }
    })
    .filter(Boolean) as Awaited<ReturnType<typeof adaptShopifyProduct>>[]

  return (
    <div className="min-h-screen flex flex-col">
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8">{title}</h1>
          <div className="prose prose-lg max-w-none text-muted-foreground">{introContent}</div>
          <div className="mt-8 flex flex-wrap gap-4">
            {internalLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center px-4 py-2 rounded-md border border-border bg-background font-medium text-sm hover:bg-muted"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {adaptedProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Shop This Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adaptedProducts.slice(0, 12).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <p className="mt-8 text-center">
              <Link href="/shop" className="font-medium text-gold underline underline-offset-2">
                View all products →
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight mb-8">FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`landing-faq-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}
