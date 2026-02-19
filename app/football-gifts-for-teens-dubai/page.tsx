import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getProducts } from "@/lib/shopify"
import { LandingPageTemplate } from "@/components/landing/landing-page-template"

export const metadata: Metadata = {
  title: "Football Gifts for Teens Dubai | Gifts for Boys UAE | Lemah",
  description:
    "Football gifts for teens and boys in Dubai & UAE. Perfect for bedrooms and match day. UAE delivery.",
  openGraph: {
    title: "Football Gifts for Teens Dubai | Gifts for Boys UAE | Lemah",
    description: "Football gifts for teens and boys. Dubai & UAE delivery.",
  },
}

const FOOTBALL_GIFTS_TEENS_FAQ = [
  {
    q: "What are the best football gifts for teens in Dubai?",
    a: "Teens in Dubai love our collectible frames, wall art, and premium football accessories. They make ideal football bedroom decor and unique gifts. Browse this page and our shop for the full selection.",
  },
  {
    q: "Do you have football gifts for boys in the UAE?",
    a: "Yes. Our collection includes gifts that appeal to boys and young football fans — from wall art and frames to bags and match day essentials. All ship across the UAE.",
  },
  {
    q: "Are your football gifts good for teenage boys?",
    a: "Yes. Many of our products are popular as football gifts for teenage boys — perfect for birthdays, match day, or as football room decor. Quality and style that teens actually want.",
  },
  {
    q: "Do you deliver football gifts for teens to Dubai?",
    a: "Yes. We deliver across Dubai and the UAE. Your football gift for a teen will be processed and shipped to your chosen address.",
  },
  {
    q: "Can I use these as football bedroom decor in Dubai?",
    a: "Absolutely. Our frames and wall art are designed for display in bedrooms, game rooms, or offices. They make great football room decor for teens and boys in Dubai and the UAE.",
  },
]

export default async function FootballGiftsForTeensDubaiPage() {
  const { products } = await getProducts({ first: 16 })
  const internalLinks = [
    { label: "Football gifts Dubai", href: "/football-gifts-dubai" },
    { label: "Football gifts UAE", href: "/football-gifts-uae" },
    { label: "Ronaldo gifts Dubai", href: "/ronaldo-gifts-dubai" },
    { label: "Messi gifts Dubai", href: "/messi-gifts-dubai" },
    { label: "Full shop", href: "/shop" },
  ]

  return (
    <>
      <Header />
      <main className="pt-24">
        <LandingPageTemplate
          title="Football Gifts for Teens Dubai"
          introContent={
            <>
              <p>
                Football gifts for teens in Dubai and the UAE are some of our most popular picks. Teens and boys who
                love the game want more than basic gear — they want collectible frames, wall art, and premium
                accessories that look great in their room and on match day. Lemah delivers exactly that, with fast
                delivery across Dubai and the UAE.
              </p>
              <p>
                A football gift for a teenage boy should feel special. Our selection includes pieces that work as
                football bedroom decor, as well as bags and match day essentials. Whether you are buying for a son,
                nephew, or friend, you will find options that suit every budget and style. All orders ship to Dubai
                and the wider UAE.
              </p>
              <p>
                Football gifts for boys in the UAE do not have to be boring. We focus on premium quality and
                collectible appeal — so your gift stands out. Explore our football gifts for teens Dubai collection
                here, then check our football gifts Dubai, Ronaldo gifts Dubai, and Messi gifts Dubai pages for more
                ideas. Perfect for birthdays, holidays, or just because.
              </p>
            </>
          }
          faq={FOOTBALL_GIFTS_TEENS_FAQ}
          products={products}
          internalLinks={internalLinks}
        />
      </main>
      <Footer />
    </>
  )
}
