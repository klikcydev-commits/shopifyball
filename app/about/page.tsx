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

export const metadata: Metadata = {
  title: "About Lemah | Football Gifts Dubai & UAE",
  description:
    "Premium football accessories and gifts in Dubai & UAE. Quality collectibles, UAE delivery, gift-ready packaging.",
  openGraph: {
    title: "About Lemah | Football Gifts Dubai & UAE",
    description: "Premium football accessories and gifts. UAE delivery, gift-ready, collectible quality.",
  },
}

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
