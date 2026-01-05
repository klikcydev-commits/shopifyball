import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSlider } from '@/components/home/hero-slider'
import { FeaturedProducts } from '@/components/home/featured-products'
import { FeaturedCategories } from '@/components/home/featured-categories'
import { Testimonials } from '@/components/home/testimonials'
import { Newsletter } from '@/components/home/newsletter'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="h-screen bg-navy" />}>
          <HeroSlider />
        </Suspense>
        <Suspense fallback={<div className="section-padding bg-cream" />}>
          <FeaturedProducts />
        </Suspense>
        <Suspense fallback={<div className="section-padding bg-background" />}>
          <FeaturedCategories />
        </Suspense>
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}


