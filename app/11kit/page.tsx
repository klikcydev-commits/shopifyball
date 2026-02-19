import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { KitComingSoon } from "@/components/kit/kit-coming-soon"

export const metadata: Metadata = {
  title: "11Kit Coming Soon | Lemah",
  description:
    "Build your 11Kit — coming soon. Curated football accessory system for Dubai & UAE.",
  robots: "noindex, follow",
  openGraph: {
    title: "11Kit Coming Soon | Lemah",
    description: "Build your 11Kit — coming soon. Curated football accessory system for Dubai & UAE.",
  },
}

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
