import type { Metadata } from "next"
import { getCollections } from "@/lib/shopify"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCollections } from "@/components/home/featured-collections"
import { FeaturedProducts } from "@/components/home/featured-products"
import { HomeSeoSections } from "@/components/home/home-seo-sections"
import { HomeFaq } from "@/components/home/home-faq"
import { ElevenKitTeaser } from "@/components/home/eleven-kit-teaser"
import { Lookbook } from "@/components/home/lookbook"
import { UaeDeliveryAreas } from "@/components/seo/UaeDeliveryAreas"
import { getPageMetadata } from "@/lib/seo/build-metadata"

export const metadata: Metadata = getPageMetadata("/")

export default async function HomePage() {
  let collections: Awaited<ReturnType<typeof getCollections>> = []
  try {
    collections = await getCollections(6)
    // Ensure CR7 (Ronaldo) collection is always first
    const cr7Index = collections.findIndex(
      (c) => c.title.toLowerCase().includes("cr7") || c.handle.toLowerCase() === "cr7"
    )
    if (cr7Index > 0) {
      const cr7 = collections[cr7Index]
      collections = [cr7, ...collections.slice(0, cr7Index), ...collections.slice(cr7Index + 1)]
    }
  } catch (e) {
    console.error("Home: failed to fetch collections", e)
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedCollections collections={collections} />
        <FeaturedProducts />
        <HomeSeoSections />
        <HomeFaq />
        <ElevenKitTeaser />
        <Lookbook />
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UaeDeliveryAreas />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
