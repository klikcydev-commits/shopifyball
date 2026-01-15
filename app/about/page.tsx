import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AboutHero } from "@/components/about/about-hero"
import { TheRitual } from "@/components/about/the-ritual"
import { DesignPrinciples } from "@/components/about/design-principles"
import { OriginStory } from "@/components/about/origin-story"
import { MaterialsCraft } from "@/components/about/materials-craft"
import { Sustainability } from "@/components/about/sustainability"
import { AboutCta } from "@/components/about/about-cta"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <TheRitual />
        <DesignPrinciples />
        <OriginStory />
        <MaterialsCraft />
        <Sustainability />
        <AboutCta />
      </main>
      <Footer />
    </>
  )
}
