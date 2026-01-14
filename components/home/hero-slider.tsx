'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

const heroSlides = [
  {
    id: 1,
    badge: 'Official Real Madrid Accessories',
    title: 'LeMah - REAL MADRID',
    titleHighlight: 'COLLECTION',
    description: 'Authentic Real Madrid accessories and merchandise. Show your support for Los Blancos with official gear and collectibles.',
    image: '/hero/143e766fa898a0c6d2b3306e6f0399a1.jpg',
    cta: 'Shop Now',
    ctaLink: '/search',
  },
  {
    id: 2,
    badge: 'Official Merchandise',
    title: 'WEAR THE',
    titleHighlight: 'CREST',
    description: 'Official Real Madrid jerseys, scarves, and accessories. Authentic merchandise for true Madridistas.',
    image: '/hero/50f8d3f1432e84d6ca0e973b063c4202.jpg',
    cta: 'Explore Collection',
    ctaLink: '/search',
  },
  {
    id: 3,
    badge: 'Match Day Essentials',
    title: 'SUPPORT REAL',
    titleHighlight: 'MADRID',
    description: 'Complete your match day look with official Real Madrid accessories. From jerseys to scarves, we have everything you need.',
    image: '/hero/9bfa24ff77e7fd01ee3bcfd17d7f7fc0.jpg',
    cta: 'Shop Now',
    ctaLink: '/search',
  },
  {
    id: 4,
    badge: 'The 11 Kit',
    title: 'REAL MADRID',
    titleHighlight: 'KIT',
    description: 'Official Real Madrid kits and accessories. Premium quality merchandise for the ultimate Madridista experience.',
    image: '/hero/ae7d957f2c45de5aaa5ed7cbb0356459.jpg',
    cta: 'View Collection',
    ctaLink: '/search',
  },
  {
    id: 5,
    badge: 'New Arrivals',
    title: 'LATEST REAL',
    titleHighlight: 'MADRID',
    description: 'Discover the newest Real Madrid accessories and merchandise. Stay ahead with the latest official gear.',
    image: '/hero/b31949241432d0ca148b2fb051ff2eb8.jpg',
    cta: 'Shop New',
    ctaLink: '/search',
  },
  {
    id: 6,
    badge: 'LeMah Exclusive',
    title: 'JOIN THE',
    titleHighlight: 'MADRIDISTAS',
    description: 'Join millions of Real Madrid fans worldwide. Authentic accessories and merchandise for true supporters.',
    image: '/hero/cd87e0c0b2b6bb096b297a54db9850c4.jpg',
    cta: 'Get Started',
    ctaLink: '/search',
  },
]

export function HeroSlider() {
  const plugin = useRef(
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: false,
      playOnInit: true,
    })
  )

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
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
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover opacity-40"
                  priority={slide.id === 1}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/70 to-navy/90" />
                
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
        {/* No arrows - auto sliding only */}
      </Carousel>
    </section>
  )
}
