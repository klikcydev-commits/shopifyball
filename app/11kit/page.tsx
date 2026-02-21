import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { KitComingSoon } from "@/components/kit/kit-coming-soon"
import { getPageMetadata } from "@/lib/seo/build-metadata"

export const metadata: Metadata = getPageMetadata("/11kit")

export default function ElevenKitPage() {
  return (
    <>
      <Header />
      <main>
        <KitComingSoon />
      </main>
      <Footer />
    </>
  )
}
