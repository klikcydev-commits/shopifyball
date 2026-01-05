import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function HeroSlider() {
  return (
    <section className="relative min-h-screen flex items-center bg-navy overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1920&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/80 to-navy" />
      
      <div className="container-custom relative pt-32">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
            Premium Football Gear
          </span>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6">
            BUILT FOR <span className="text-gold">CHAMPIONS</span>
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mb-8">
            From the training field to game day, we equip athletes with the best equipment 
            to dominate the competition.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link href="/search">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}


