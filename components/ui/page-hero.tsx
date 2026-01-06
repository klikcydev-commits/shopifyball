'use client'

import { useRef } from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

const heroImages = [
  '/hero/143e766fa898a0c6d2b3306e6f0399a1.jpg',
  '/hero/50f8d3f1432e84d6ca0e973b063c4202.jpg',
  '/hero/9bfa24ff77e7fd01ee3bcfd17d7f7fc0.jpg',
  '/hero/ae7d957f2c45de5aaa5ed7cbb0356459.jpg',
  '/hero/b31949241432d0ca148b2fb051ff2eb8.jpg',
  '/hero/cd87e0c0b2b6bb096b297a54db9850c4.jpg',
]

interface PageHeroProps {
  title: string
  subtitle?: string
  badge?: string
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  const plugin = useRef(
    Autoplay({ 
      delay: 1000, 
      stopOnInteraction: false, 
      stopOnMouseEnter: false,
      playOnInit: true,
    })
  )

  return (
    <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full h-full absolute inset-0"
      >
        <CarouselContent className="-ml-0 h-full">
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="pl-0 h-full">
              <div className="relative h-full w-full">
                <Image
                  src={image}
                  alt={`Hero ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-navy/80" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-custom text-center">
          {badge && (
            <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
              {badge}
            </span>
          )}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

