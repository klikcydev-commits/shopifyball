import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCollections } from "@/components/home/featured-collections"
import { FeaturedProducts } from "@/components/home/featured-products"
import { ElevenKitTeaser } from "@/components/home/eleven-kit-teaser"
import { BrandStory } from "@/components/home/brand-story"
import { Testimonials } from "@/components/home/testimonials"
import { Lookbook } from "@/components/home/lookbook"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedCollections />
        <FeaturedProducts />
        <ElevenKitTeaser />
        <BrandStory />
        <Testimonials />
        <Lookbook />
      </main>
      <Footer />
    </>
  )
}
