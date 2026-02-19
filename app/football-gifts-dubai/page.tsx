import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getProducts } from "@/lib/shopify"
import { LandingPageTemplate } from "@/components/landing/landing-page-template"

export const metadata: Metadata = {
  title: "Football Gifts Dubai | Gifts for Football Fans | Lemah",
  description:
    "Find the best football gifts in Dubai. Premium accessories, wall art, and collectibles for football lovers. Fast Dubai delivery.",
  openGraph: {
    title: "Football Gifts Dubai | Gifts for Football Fans | Lemah",
    description: "Best football gifts in Dubai. Premium accessories and collectibles. Dubai delivery.",
  },
}

const FOOTBALL_GIFTS_DUBAI_FAQ = [
  {
    q: "Where can I buy football gifts in Dubai?",
    a: "You can buy football gifts in Dubai right here at Lemah. We offer premium accessories, collectible frames, and wall art with fast delivery across Dubai and the UAE.",
  },
  {
    q: "What are the best football gifts for someone in Dubai?",
    a: "Our bestsellers include collectible frames, wall art, premium bags, and match day accessories. They make ideal gifts for football fans, teens, and boys. All ship to Dubai.",
  },
  {
    q: "Do you deliver football gifts to Dubai?",
    a: "Yes. We deliver across Dubai and the wider UAE. Orders are processed and shipped so your football gift arrives in time for birthdays, match day, or any occasion.",
  },
  {
    q: "Are your football gifts unique?",
    a: "We focus on premium, collectible pieces — including frames that change with viewing angle — so your gift stands out. Perfect for football lovers in Dubai.",
  },
  {
    q: "Can I send a football gift to a friend in Dubai?",
    a: "Yes. We offer gift-ready packaging and deliver across Dubai and the UAE. You can ship directly to your friend or family.",
  },
]

export default async function FootballGiftsDubaiPage() {
  const { products } = await getProducts({ first: 16 })
  const internalLinks = [
    { label: "Football gifts UAE", href: "/football-gifts-uae" },
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
          title="Best Football Gifts in Dubai"
          introContent={
            <>
              <p>
                Looking for the best football gifts in Dubai? Lemah brings you premium football accessories, collectible
                frames, and wall art designed for football lovers. Whether you need a gift for him, a unique football
                gift, or something special for a teen fan, our collection delivers quality and style with fast Dubai
                delivery.
              </p>
              <p>
                Football gifts in Dubai should be more than generic merchandise. We focus on pieces that fans actually
                want to display — from wall art that changes with the angle to premium bags and match day essentials.
                Our football shop selection is curated for Dubai and the UAE, so you get collectible quality and
                gift-ready packaging every time.
              </p>
              <p>
                Gifts for football fans in Dubai are perfect for birthdays, match day, or simply to show you care. We
                stock options that suit every budget and taste: frames for bedroom decor, accessories for the pitch,
                and statement pieces for offices and game rooms. Delivery across Dubai and the UAE is fast and
                reliable.
              </p>
              <p>
                If you are searching for football gifts Dubai or gifts for football lovers UAE, start here. Browse our
                shop, filter by collection, or explore our dedicated pages for Ronaldo gifts Dubai, Messi gifts Dubai,
                and football gifts for teens Dubai. Every order is packed with care and shipped to your door in Dubai
                or anywhere in the UAE.
              </p>
            </>
          }
          faq={FOOTBALL_GIFTS_DUBAI_FAQ}
          products={products}
          internalLinks={internalLinks}
        />
      </main>
      <Footer />
    </>
  )
}
