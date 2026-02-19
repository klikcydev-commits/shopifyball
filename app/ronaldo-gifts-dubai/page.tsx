import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getProducts } from "@/lib/shopify"
import { LandingPageTemplate } from "@/components/landing/landing-page-template"

export const metadata: Metadata = {
  title: "Ronaldo Gifts Dubai | CR7 Football Fan Gifts | Lemah",
  description:
    "Ronaldo and CR7 football gifts in Dubai. Premium collectibles for football fans. Dubai & UAE delivery.",
  openGraph: {
    title: "Ronaldo Gifts Dubai | CR7 Football Fan Gifts | Lemah",
    description: "Ronaldo gifts in Dubai. Premium collectibles for CR7 fans. UAE delivery.",
  },
}

const RONALDO_GIFTS_DUBAI_FAQ = [
  {
    q: "Do you have Ronaldo gifts in Dubai?",
    a: "Yes. We stock Ronaldo and CR7 themed football gifts and collectibles suitable for fans in Dubai and the UAE. Browse the collection on this page or in our full shop.",
  },
  {
    q: "What Ronaldo gifts can I send to Dubai?",
    a: "Our Ronaldo-themed selection includes collectible frames, wall art, and premium accessories. They make ideal gifts for CR7 fans and ship across Dubai and the UAE.",
  },
  {
    q: "Are Ronaldo gifts good for teens in Dubai?",
    a: "Yes. Many of our Ronaldo and football gifts are popular with teens and boys in Dubai. They work well as bedroom decor and match day gifts.",
  },
  {
    q: "Do you deliver Ronaldo gifts to the UAE?",
    a: "Yes. We deliver across Dubai and the UAE. Your Ronaldo gift will be processed and shipped to your chosen address.",
  },
]

export default async function RonaldoGiftsDubaiPage() {
  const { products } = await getProducts({ first: 16 })
  const internalLinks = [
    { label: "Messi gifts Dubai", href: "/messi-gifts-dubai" },
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
          title="Ronaldo Gifts Dubai"
          introContent={
            <>
              <p>
                Ronaldo gifts in Dubai are in high demand — and for good reason. Cristiano Ronaldo and CR7 fans in
                Dubai and the UAE want collectibles and gifts that reflect their passion. Lemah offers premium
                football gifts and wall art that celebrate the game&apos;s biggest names, with fast delivery across
                Dubai and the UAE.
              </p>
              <p>
                Whether you are buying a Ronaldo gift for a friend, a teen, or yourself, our collection is built for
                quality and display. From collectible frames to premium accessories, every piece is gift-ready and
                ships to Dubai and the wider UAE. Perfect for birthdays, match day, or as football room decor.
              </p>
              <p>
                CR7 fans in Dubai deserve more than basic merchandise. We focus on pieces that stand out — ideal as a
                football gift for him or for a teenage boy who loves Ronaldo. Browse our shop for the latest Ronaldo
                gifts Dubai selection, and pair with our football gifts UAE and gifts for teens pages for more ideas.
              </p>
            </>
          }
          faq={RONALDO_GIFTS_DUBAI_FAQ}
          products={products}
          internalLinks={internalLinks}
        />
      </main>
      <Footer />
    </>
  )
}
