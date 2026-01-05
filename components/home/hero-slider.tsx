'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const heroSlides = [
  {
    id: 1,
    badge: 'Premium Football Gear',
    title: 'BUILT FOR',
    titleHighlight: 'CHAMPIONS',
    description: 'From the training field to game day, we equip athletes with the best equipment to dominate the competition.',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1920&q=80',
    cta: 'Shop Now',
    ctaLink: '/search',
  },
  {
    id: 2,
    badge: 'Elite Performance',
    title: 'TRAIN LIKE A',
    titleHighlight: 'PRO',
    description: 'Professional-grade equipment designed for serious athletes who demand the best from their gear.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80',
    cta: 'Explore Collection',
    ctaLink: '/search',
  },
  {
    id: 3,
    badge: 'Game Day Ready',
    title: 'WIN WITH',
    titleHighlight: 'CONFIDENCE',
    description: 'Step onto the field with gear that matches your ambition. Built for those who never settle.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80',
    cta: 'Shop Now',
    ctaLink: '/search',
  },
]

export function HeroSlider() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative min-h-screen flex items-center bg-navy overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/80 to-navy" />
                
                <div className="container-custom relative pt-32 w-full">
                  <div className="max-w-3xl">
                    <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
                      {slide.badge}
                    </span>
                    <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6">
                      {slide.title} <span className="text-gold">{slide.titleHighlight}</span>
                    </h1>
                    <p className="text-xl text-primary-foreground/80 max-w-2xl mb-8">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="hero" size="xl" asChild>
                        <Link href={slide.ctaLink}>
                          {slide.cta}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                      </Button>
                      <Button variant="heroOutline" size="xl" asChild>
                        <Link href="/about">Learn More</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 md:left-8 h-12 w-12 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
        <CarouselNext className="right-4 md:right-8 h-12 w-12 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
      </Carousel>
    </section>
  )
}


