import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { KitDisplay } from './kit-display'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The 11 Kit | LeMah - Real Madrid',
  description: 'Discover The 11 Kit - Official Real Madrid kit collection. Premium quality for true Madridistas.',
}

// Kit product data structure - ready for you to add your product
interface KitProduct {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  images: string[]
  features: string[]
  sizes?: string[]
  inStock: boolean
}

// Placeholder - you'll add your actual product data here later
const kitProducts: KitProduct[] = [
  // Add your "The 11 Kit" product data here when ready
  // Example structure:
  // {
  //   id: 'the-11-kit',
  //   name: 'The 11 Kit',
  //   description: 'Complete Real Madrid kit...',
  //   price: '$199.99',
  //   images: ['/path/to/image1.jpg', '/path/to/image2.jpg'],
  //   features: ['Official jersey', 'Shorts', 'Socks', 'Complete set'],
  //   sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  //   inStock: true,
  // }
]

export default function KitPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src="/hero/ae7d957f2c45de5aaa5ed7cbb0356459.jpg"
              alt="The 11 Kit"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
          
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-custom text-center relative z-10">
              <div className="inline-block px-6 py-3 bg-gold/20 backdrop-blur-sm border-2 border-gold/40 rounded-full text-gold text-sm font-bold uppercase tracking-widest mb-8 animate-fade-in">
                Exclusive Collection
              </div>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-primary-foreground mb-6 leading-tight">
                <span className="block">THE</span>
                <span className="block text-gold drop-shadow-2xl">11 KIT</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                Official Real Madrid kit collection. Premium quality designed for champions.
                <br />
                <span className="text-gold font-semibold">Authentic. Exclusive. Legendary.</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#kit-display" 
                  className="px-8 py-4 bg-gold text-navy font-bold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 uppercase tracking-wider"
                >
                  View Collection
                </a>
                <a 
                  href="#kit-display" 
                  className="px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-bold rounded-lg hover:bg-primary-foreground hover:text-navy transition-all duration-300 uppercase tracking-wider"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>
        
        {/* Kit Display Section */}
        <section id="kit-display" className="section-padding bg-gradient-to-b from-cream via-background to-cream">
          <div className="container-custom">
            <KitDisplay products={kitProducts} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
