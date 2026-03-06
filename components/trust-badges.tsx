'use client'

import Image from 'next/image'
import { Shield, Truck, RotateCcw, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Shopify Secure badges - imported from Shopify CDN, stored locally */
const SHOPIFY_BADGE_WHITE = '/shopify-secure-badge-white.svg'
const SHOPIFY_BADGE_DARK = '/shopify-secure-badge-dark.svg'

const BADGES = [
  {
    icon: Truck,
    label: 'Free Delivery',
    ariaLabel: 'Free delivery across UAE',
  },
  {
    icon: RotateCcw,
    label: '15 Days Return',
    ariaLabel: '15 days return policy',
  },
  {
    icon: CreditCard,
    label: 'Secure Payment',
    ariaLabel: 'Secure payment options',
  },
  {
    icon: Shield,
    label: 'Quality Guaranteed',
    ariaLabel: 'Quality guaranteed',
  },
] as const

interface TrustBadgesProps {
  variant?: 'default' | 'compact' | 'footer'
  showShopifyBadge?: boolean
  className?: string
}

/**
 * Trust badges for Shopify store - builds customer confidence.
 * Use on product pages, cart, footer.
 */
export function TrustBadges({
  variant = 'default',
  showShopifyBadge = true,
  className,
}: TrustBadgesProps) {
  const isDark = variant === 'footer'
  const shopifyBadgeSrc = isDark ? SHOPIFY_BADGE_WHITE : SHOPIFY_BADGE_DARK

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-4',
        variant === 'compact' && 'gap-x-2 gap-y-1.5 sm:gap-3',
        variant === 'footer' && 'justify-center gap-4 sm:gap-6',
        className
      )}
      role="group"
      aria-label="Trust badges"
    >
      {BADGES.map(({ icon: Icon, label, ariaLabel }) => (
        <div
          key={label}
          className={cn(
            'flex items-center gap-2',
            variant === 'compact'
              ? 'text-[11px] sm:text-xs text-muted-foreground'
              : 'text-xs sm:text-sm text-muted-foreground',
            variant === 'footer' && 'text-white/70'
          )}
          aria-label={ariaLabel}
        >
          <Icon
            className={cn(
              'shrink-0',
              variant === 'compact' ? 'h-3 w-3 sm:h-3.5 sm:w-3.5' : 'h-3.5 w-3.5 sm:h-4 sm:w-4',
              variant === 'footer' ? 'text-gold' : 'text-accent'
            )}
            aria-hidden
          />
          <span>{label}</span>
        </div>
      ))}
      {showShopifyBadge && (
        <a
          href="https://www.shopify.com/security/pci-compliant"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={cn(
            'inline-flex items-center transition-opacity hover:opacity-80',
            variant === 'footer' && 'opacity-90'
          )}
          title="Secured by Shopify"
          aria-label="Secured by Shopify - PCI compliant"
        >
          <Image
            src={shopifyBadgeSrc}
            alt="Secured by Shopify"
            width={variant === 'compact' ? 70 : 90}
            height={variant === 'compact' ? 28 : 36}
            className={cn(
              'h-auto object-contain',
              variant === 'compact' ? 'h-6' : 'h-7'
            )}
          />
        </a>
      )}
    </div>
  )
}
