import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getProducts } from "@/lib/shopify"
import { LandingPageTemplate } from "@/components/landing/landing-page-template"

export const metadata: Metadata = {
  title: "Football Gifts UAE | Gifts for Football Lovers | Lemah",
  description:
    "Shop football gifts across the UAE. Premium accessories, wall art, and collectibles for football fans. UAE delivery.",
  openGraph: {
    title: "Football Gifts UAE | Gifts for Football Lovers | Lemah",
    description: "Football gifts across the UAE. Premium accessories and collectibles.",
  },
}

const FOOTBALL_GIFTS_UAE_FAQ = [
  {
    q: "Do you deliver football gifts across the UAE?",
    a: "Yes. We deliver across the UAE, including Dubai, Abu Dhabi, Sharjah, and other emirates. Your football gifts will be processed and shipped to your address.",
  },
  {
    q: "What football gifts can I buy in the UAE?",
    a: "We offer premium football accessories, collectible frames, wall art, bags, and match day essentials. Ideal as gifts for football lovers, teens, and boys. Browse our full shop for the complete range.",
  },
  {
    q: "Are you a football store in the UAE?",
    a: "Lemah is a premium football gifts and accessories store for the UAE. We focus on quality collectibles and gifts for football fans, with UAE-wide delivery.",
  },
  {
    q: "Can I get Ronaldo or Messi gifts in the UAE?",
    a: "Yes. We stock Ronaldo and Messi themed gifts and collectibles. See our Ronaldo gifts Dubai and Messi gifts Dubai pages, or browse the shop — all ship across the UAE.",
  },
  {
    q: "What are good football gifts for teens in the UAE?",
    a: "Teens in the UAE love our wall art, frames, and premium accessories. They work well as football bedroom decor and unique gifts. Check our football gifts for teens Dubai page for curated picks.",
  },
]

export default async function FootballGiftsUaePage() {
  const { products } = await getProducts({ first: 16 })
  const internalLinks = [
    { label: "Football gifts Dubai", href: "/football-gifts-dubai" },
    { label: "Ronaldo gifts Dubai", href: "/ronaldo-gifts-dubai" },
    { label: "Messi gifts Dubai", href: "/messi-gifts-dubai" },
    { label: "Gifts for teens", href: "/football-gifts-for-teens-dubai" },
    { label: "Full shop", href: "/shop" },
  ]

  return (
    <>
      <Header />
      <main className="pt-24">
        <LandingPageTemplate
          title="Football Gifts UAE"
          introContent={
            <>
              <p>
                Football gifts in the UAE are easy to find when you know where to look. Lemah offers a curated
                selection of premium football accessories, wall art, and collectibles for fans across Dubai, Abu Dhabi,
                Sharjah, and the rest of the UAE. Whether you are buying for yourself or as a gift for a football
                lover, we deliver nationwide.
              </p>
              <p>
                Our football store brings together quality and style. From collectible frames and football wall art to
                bags and match day essentials, every piece is chosen with UAE football fans in mind. Gifts for football
                lovers UAE-wide include options for teens, boys, and dedicated collectors — all with reliable UAE
                delivery.
              </p>
              <p>
                If you are searching for football gifts UAE or a football shop that ships across the Emirates, you are
                in the right place. We also have dedicated pages for football gifts Dubai, Ronaldo gifts Dubai, Messi
                gifts Dubai, and football gifts for teens — so you can quickly find the right gift. Every order is
                packed with care and shipped to your door anywhere in the UAE.
              </p>
            </>
          }
          faq={FOOTBALL_GIFTS_UAE_FAQ}
          products={products}
          internalLinks={internalLinks}
        />
      </main>
      <Footer />
    </>
  )
}
