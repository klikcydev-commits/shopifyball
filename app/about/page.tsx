import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AboutHero } from "@/components/about/about-hero"
import { TheRitual } from "@/components/about/the-ritual"
import { DesignPrinciples } from "@/components/about/design-principles"
import { OriginStory } from "@/components/about/origin-story"
import { MaterialsCraft } from "@/components/about/materials-craft"
import { Sustainability } from "@/components/about/sustainability"
import { AboutCta } from "@/components/about/about-cta"
import { getProducts } from "@/lib/shopify"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import type { Product } from "@/lib/shopify-types"

export const metadata: Metadata = {
  title: "About Lemah | Collectible Football Frames & Gifts Dubai UAE",
  description:
    "Premium collectible frames UAE — CR7, Mbappé, Ronaldo & Messi. Football gifts Dubai. UAE delivery, gift-ready packaging. Discover LEMAH.",
  keywords: [
    "collectible frames UAE",
    "football gifts Dubai",
    "football accessories UAE",
    "UAE delivery",
    "gift-ready packaging",
    "LEMAH",
  ],
  openGraph: {
    title: "About Lemah | Collectible Football Frames & Gifts Dubai UAE",
    description:
      "Premium collectible frames UAE. Football gifts Dubai. UAE delivery, gift-ready packaging. CR7, Mbappé, Ronaldo & Messi.",
  },
}

export default async function AboutPage() {
  let products: Product[] = []
  try {
    const { products: shopifyProducts } = await getProducts({ first: 48 })
    products = (shopifyProducts ?? []).map(adaptShopifyProduct)
  } catch {
    // Continue with empty; MaterialsCraft will show static grid
  }

  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <TheRitual />
        <DesignPrinciples />
        <OriginStory />
        <MaterialsCraft products={products} />
        <Sustainability />
        <AboutCta />
      </main>
      <Footer />
    </>
  )
}
