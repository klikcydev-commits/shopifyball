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
import { UaeDeliveryAreas } from "@/components/seo/UaeDeliveryAreas"
import { getPageMetadata } from "@/lib/seo/build-metadata"
import { getProducts } from "@/lib/shopify"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import type { Product } from "@/lib/shopify-types"

export const metadata: Metadata = getPageMetadata("/about")

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
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UaeDeliveryAreas />
          </div>
        </section>
        <AboutCta />
      </main>
      <Footer />
    </>
  )
}
