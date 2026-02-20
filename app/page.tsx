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
import { BrandStory } from "@/components/home/brand-story"
import { Testimonials } from "@/components/home/testimonials"
import { Lookbook } from "@/components/home/lookbook"

export const metadata: Metadata = {
  title: "Football Gifts Dubai & UAE | Lemah",
  description:
    "Shop premium football gifts, wall art, and collectible frames in Dubai & UAE. Perfect for teens and football fans. Fast UAE delivery.",
  openGraph: {
    title: "Football Gifts Dubai & UAE | Lemah",
    description: "Premium football gifts, wall art & collectibles in Dubai & UAE. Perfect for teens and football lovers.",
  },
}

export default async function HomePage() {
  let collections: Awaited<ReturnType<typeof getCollections>> = []
  try {
    collections = await getCollections(6)
  } catch (e) {
    console.error("Home: failed to fetch collections", e)
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedCollections collections={collections} />
        <HomeSeoSections />
        <FeaturedProducts />
        <HomeFaq />
        <ElevenKitTeaser />
        <BrandStory />
        <Testimonials />
        <Lookbook />
      </main>
      <Footer />
    </>
  )
}
