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
    badge: 'Premium Football Gear',
    title: 'BUILT FOR',
    titleHighlight: 'CHAMPIONS',
    description: 'From the training field to game day, we equip athletes with the best equipment to dominate the competition.',
    image: '/hero/143e766fa898a0c6d2b3306e6f0399a1.jpg',
    cta: 'Shop Now',
    ctaLink: '/search',
  },
  {
    id: 2,
    badge: 'Elite Performance',
    title: 'TRAIN LIKE A',
    titleHighlight: 'PRO',
    description: 'Professional-grade equipment designed for serious athletes who demand the best from their gear.',
    image: '/hero/50f8d3f1432e84d6ca0e973b063c4202.jpg',
    cta: 'Explore Collection',
    ctaLink: '/search',
  },
  {
    id: 3,
    badge: 'Game Day Ready',
    title: 'WIN WITH',
    titleHighlight: 'CONFIDENCE',
    description: 'Step onto the field with gear that matches your ambition. Built for those who never settle.',
    image: '/hero/9bfa24ff77e7fd01ee3bcfd17d7f7fc0.jpg',
    cta: 'Shop Now',
    ctaLink: '/search',
  },
  {
    id: 4,
    badge: 'Signature Collection',
    title: 'THE 11',
    titleHighlight: 'KIT',
    description: 'Exclusive gear for the ultimate football experience. Premium quality meets iconic design.',
    image: '/hero/ae7d957f2c45de5aaa5ed7cbb0356459.jpg',
    cta: 'View Collection',
    ctaLink: '/search',
  },
  {
    id: 5,
    badge: 'New Arrivals',
    title: 'DOMINATE THE',
    titleHighlight: 'FIELD',
    description: 'Discover the latest in football innovation. Gear engineered for peak performance.',
    image: '/hero/b31949241432d0ca148b2fb051ff2eb8.jpg',
    cta: 'Shop New',
    ctaLink: '/search',
  },
  {
    id: 6,
    badge: 'LeMah Exclusive',
    title: 'ELEVATE YOUR',
    titleHighlight: 'GAME',
    description: 'Join the champions who trust LeMah for their football journey.',
    image: '/hero/cd87e0c0b2b6bb096b297a54db9850c4.jpg',
    cta: 'Get Started',
    ctaLink: '/search',
  },
]

export function HeroSlider() {
  const plugin = useRef(
    Autoplay({ delay: 1000, stopOnInteraction: false, stopOnMouseEnter: false })
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
