import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getProducts } from "@/lib/shopify"
import { LandingPageTemplate } from "@/components/landing/landing-page-template"

export const metadata: Metadata = {
  title: "Messi Gifts Dubai | Lionel Messi Football Gifts | Lemah",
  description:
    "Messi and Lionel Messi football gifts in Dubai. Premium collectibles for football fans. UAE delivery—Dubai, Abu Dhabi, Sharjah & more.",
  openGraph: {
    title: "Messi Gifts Dubai | Lionel Messi Football Gifts | Lemah",
    description: "Messi gifts in Dubai. UAE delivery—Dubai, Abu Dhabi, Sharjah & more. Gift-ready packaging.",
  },
}

const MESSI_GIFTS_DUBAI_FAQ = [
  {
    q: "Do you have Messi gifts in Dubai?",
    a: "Yes. We stock Lionel Messi themed football gifts and collectibles for fans in Dubai and the UAE. Browse this page or our full shop for current selections.",
  },
  {
    q: "What Messi gifts can I send to Dubai?",
    a: "Our Messi-themed range includes collectible frames, wall art, and premium accessories. They make great gifts for Messi fans and ship across Dubai and the UAE.",
  },
  {
    q: "Are Messi gifts good for teens in Dubai?",
    a: "Yes. Many of our Messi and football gifts are popular with teens and boys in Dubai. They work well as bedroom decor and as gifts for young football fans.",
  },
  {
    q: "Do you deliver Messi gifts to the UAE?",
    a: "Yes. We deliver across Dubai and the UAE. Your Messi gift will be processed and shipped to your chosen address.",
  },
]

export default async function MessiGiftsDubaiPage() {
  const { products } = await getProducts({ first: 16 })
  const internalLinks = [
    { label: "Ronaldo gifts Dubai", href: "/ronaldo-gifts-dubai" },
    { label: "Football gifts Dubai", href: "/football-gifts-dubai" },
    { label: "Football gifts UAE", href: "/football-gifts-uae" },
    { label: "Gifts for teens", href: "/football-gifts-for-teens-dubai" },
    { label: "Full shop", href: "/shop" },
  ]

  return (
    <>
      <Header />
      <main className="pt-24">
        <LandingPageTemplate
          title="Messi Gifts Dubai"
          introContent={
            <>
              <p>
                Messi gifts in Dubai are a hit with football fans who follow Lionel Messi. At Lemah we offer premium
                football gifts and collectibles that celebrate the game&apos;s greats, with fast delivery across Dubai
                and the UAE. Whether you are shopping for a Messi fan or for yourself, our selection is built for
                quality and display.
              </p>
              <p>
                Lionel Messi fans in Dubai and the UAE want gifts that feel special. Our frames, wall art, and
                accessories are designed to do exactly that — gift-ready and ideal for football bedroom decor or
                match day. Every order ships to Dubai and across the UAE, so your Messi gift arrives in time.
              </p>
              <p>
                From collectible pieces to premium accessories, our Messi gifts Dubai collection fits every budget.
                Pair with our Ronaldo gifts Dubai, football gifts for teens, and full shop for more ideas. We are
                your football gifts and accessories store for Dubai and the UAE.
              </p>
            </>
          }
          faq={MESSI_GIFTS_DUBAI_FAQ}
          products={products}
          internalLinks={internalLinks}
        />
      </main>
      <Footer />
    </>
  )
}
