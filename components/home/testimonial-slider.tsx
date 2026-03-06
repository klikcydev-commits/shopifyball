'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/lib/utils'

/** Shopify Secure badge - imported from Shopify, stored locally */
const SHOPIFY_BADGE_WHITE = '/shopify-secure-badge-white.svg'

/** Hero-style images for testimonial cards - lifestyle / wall art / room decor */
const TESTIMONIAL_IMAGES = [
  '/hero/143e766fa898a0c6d2b3306e6f0399a1.jpg',
  '/hero/50f8d3f1432e84d6ca0e973b063c4202.jpg',
  '/hero/9bfa24ff77e7fd01ee3bcfd17d7f7fc0.jpg',
  '/hero/ae7d957f2c45de5aaa5ed7cbb0356459.jpg',
  '/hero/b31949241432d0ca148b2fb051ff2eb8.jpg',
  '/hero/cd87e0c0b2b6bb096b297a54db9850c4.jpg',
]

interface Testimonial {
  name: string
  lang: 'ar' | 'en'
  rating: number
  text: string
  image?: string
}

const TESTIMONIALS: Testimonial[] = [
  { name: 'Ahmed', lang: 'ar', rating: 5, text: 'الطباعة مرة حلوة والكواليتي ممتازة' },
  { name: 'Sara', lang: 'en', rating: 5, text: 'Absolutely love it. It looks even better in person.' },
  { name: 'Noor', lang: 'ar', rating: 5, text: 'الإطار مرتب والشغل كلين جدًا' },
  { name: 'Charbel', lang: 'en', rating: 5, text: 'Very clean print and the finish looks premium.' },
  { name: 'Reem', lang: 'ar', rating: 5, text: 'طلع أحلى من الصور بصراحة 😍' },
  { name: 'Elie', lang: 'en', rating: 5, text: 'Just as expected. Really happy with it.' },
  { name: 'Huda', lang: 'ar', rating: 5, text: 'اللوحة طالعة وايد حلوة على الجدار' },
  { name: 'Omar', lang: 'en', rating: 5, text: 'Great quality and very nice details.' },
  { name: 'Dana', lang: 'ar', rating: 5, text: 'أحببته، يعطي المكان لمسة حلوة' },
  { name: 'Faisal', lang: 'en', rating: 5, text: 'Looks amazing on the wall 🔥' },
  { name: 'Maha', lang: 'ar', rating: 5, text: 'الطباعة واضحة والتفاصيل مرتبة' },
  { name: 'Yousef', lang: 'en', rating: 5, text: 'The packaging was good and the print looks sharp.' },
  { name: 'Layan', lang: 'ar', rating: 5, text: 'الكواليتي ممتازة والشكل النهائي جميل' },
  { name: 'Ali', lang: 'en', rating: 5, text: 'Everyone keeps asking me where I got it.' },
  { name: 'Maryam', lang: 'ar', rating: 5, text: 'مرة حبيته، شكله فخم ومرتب' },
  { name: 'Jad', lang: 'en', rating: 5, text: '100/100. Beautiful piece.' },
  { name: 'Fatima', lang: 'ar', rating: 5, text: 'الشغل كلين والطباعة تجنن' },
  { name: 'Tarek', lang: 'en', rating: 5, text: 'Simple, elegant, and exactly what I wanted.' },
]

interface TestimonialSliderProps {
  className?: string
  variant?: 'default' | 'compact'
}

export function TestimonialSlider({ className, variant = 'default' }: TestimonialSliderProps) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const plugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true,
    }) as any
  )

  return (
    <div
      className={cn(
        'w-full overflow-hidden min-w-0',
        variant === 'default' && 'py-12 sm:py-16 md:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8',
        variant === 'default' ? 'bg-[#facc15]' : '',
        className
      )}
    >
      {variant === 'default' && (
        <h3 className="text-center text-base sm:text-lg md:text-xl font-semibold text-[#1a1a1a] mb-8 sm:mb-10 px-2">
          Loved by everyone, everywhere. Don&apos;t miss out.
        </h3>
      )}
      {variant === 'compact' && (
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2">
          <h3 className="text-center text-xs sm:text-sm font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold">
            What customers say
          </h3>
          <div
            className="inline-flex items-center gap-2 sm:gap-3"
            title="Verified Reviews"
            aria-label="Verified Reviews"
          >
            <span className="inline-block h-10 w-10 sm:h-12 sm:w-12 shrink-0 [&>img]:mix-blend-multiply">
              <Image
                src="/verified-reviews-badge.png"
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                aria-hidden
              />
            </span>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground">
                Verified
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground">
                Reviews
              </span>
            </div>
          </div>
        </div>
      )}
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: 'center',
          loop: true,
          slidesToScroll: 1,
          containScroll: 'trimSnaps',
          dragFree: false,
        }}
        className="relative w-full max-w-7xl mx-auto px-1 sm:px-0"
      >
        {/* Fade overlays - edges match section background so cards blend seamlessly */}
        <div
          className="absolute left-0 top-0 bottom-16 w-12 sm:w-20 md:w-28 lg:w-32 pointer-events-none z-10"
          style={{
            background:
              variant === 'default'
                ? 'linear-gradient(to right, #facc15, transparent)'
                : 'linear-gradient(to right, color-mix(in srgb, var(--muted) 50%, var(--background)), transparent)',
          }}
          aria-hidden
        />
        <div
          className="absolute right-0 top-0 bottom-16 w-12 sm:w-20 md:w-28 lg:w-32 pointer-events-none z-10"
          style={{
            background:
              variant === 'default'
                ? 'linear-gradient(to left, #facc15, transparent)'
                : 'linear-gradient(to left, color-mix(in srgb, var(--muted) 50%, var(--background)), transparent)',
          }}
          aria-hidden
        />
        <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
          {TESTIMONIALS.map((t, i) => {
            const imageSrc = t.image ?? TESTIMONIAL_IMAGES[i % TESTIMONIAL_IMAGES.length]
            return (
              <CarouselItem
                key={`${t.name}-${i}`}
                className={cn(
                  'pl-2 sm:pl-3 md:pl-4',
                  /* Responsive: 1 card mobile, 1.5 sm, 2 md, 3-4 lg */
                  'basis-[85%] sm:basis-[70%] md:basis-[48%] lg:basis-[calc(25%-12px)] min-w-0'
                )}
              >
                <article
                  className={cn(
                    'rounded-xl sm:rounded-2xl overflow-hidden',
                    'bg-[#0f0f0f] text-white',
                    'shadow-xl',
                    variant === 'compact' ? 'p-3 sm:p-4' : 'flex flex-col'
                  )}
                >
                  {/* Large rounded image - hero of the card */}
                  {variant !== 'compact' && (
                    <div className="relative aspect-[4/5] w-full flex-shrink-0 overflow-hidden rounded-t-2xl">
                      <Image
                        src={imageSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 48vw, 360px"
                      />
                    </div>
                  )}

                  <div
                    className={cn(
                      'flex flex-col items-center text-center',
                      variant === 'default' ? 'px-4 sm:px-5 pt-4 sm:pt-5 pb-5 sm:pb-6' : 'px-0 pb-0'
                    )}
                  >
                    {/* 5 stars - centered */}
                    <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4" aria-hidden>
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#facc15] text-[#facc15]" />
                      ))}
                    </div>

                    {/* Testimonial text - centered */}
                    <blockquote
                      className={cn(
                        'text-white/95 leading-relaxed mb-3 sm:mb-4',
                        variant === 'compact' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                      )}
                      dir={t.lang === 'ar' ? 'rtl' : 'ltr'}
                    >
                      &ldquo;{t.text}&rdquo;
                    </blockquote>

                    {/* Reviewer name - first name only */}
                    <p className="text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">{t.name}</p>

                    {/* Shopify verified badge - trust indicator for every testimonial */}
                    <a
                      href="https://www.shopify.com/security/pci-compliant"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
                      title="Secured by Shopify"
                      aria-label="Secured by Shopify"
                    >
                      <Image
                        src={SHOPIFY_BADGE_WHITE}
                        alt="Shopify Secure"
                        width={80}
                        height={32}
                        className="h-5 sm:h-6 w-auto object-contain"
                      />
                    </a>
                  </div>
                </article>
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className={cn(
              'p-2 sm:p-2.5 rounded-full transition-colors touch-manipulation',
              variant === 'default'
                ? 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
                : 'border border-border bg-background hover:bg-muted'
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className={cn(
              'p-2 sm:p-2.5 rounded-full transition-colors touch-manipulation',
              variant === 'default'
                ? 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
                : 'border border-border bg-background hover:bg-muted'
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </Carousel>
    </div>
  )
}
