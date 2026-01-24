import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { KitHero } from "@/components/kit/kit-hero"
import { KitBuilder } from "@/components/kit/kit-builder"
import { KitStory } from "@/components/kit/kit-story"
import { KitFaq } from "@/components/kit/kit-faq"

export default function ElevenKitPage() {
  return (
    <>
      <Header />
      <main>
        <KitHero />
        <KitBuilder />
        <KitStory />
        <KitFaq />
      </main>
      <Footer />
    </>
  )
}
