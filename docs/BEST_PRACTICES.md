# Ecommerce Best Practices

## Performance Optimization

### 1. Use Server Components
```typescript
// ✅ Good: Server Component (default)
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle)
  return <ProductDetails product={product} />
}

// ❌ Avoid: Client-side data fetching
'use client'
export default function ProductPage() {
  const [product, setProduct] = useState(null)
  useEffect(() => {
    fetch('/api/product').then(r => r.json()).then(setProduct)
  }, [])
}
```

### 2. Implement Proper Caching
```typescript
// Cache product data for 1 hour
export const revalidate = 3600

// Or use Next.js fetch cache
const product = await fetch(url, { 
  next: { revalidate: 3600 } 
})
```

### 3. Optimize Images
```typescript
// Always use Next.js Image component
import Image from 'next/image'

<Image
  src={product.image.url}
  alt={product.title}
  width={500}
  height={500}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isAboveFold}
  loading="lazy"
/>
```

### 4. Code Splitting
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const CartModal = dynamic(() => import('@/components/cart/cart-modal'), {
  loading: () => <CartSkeleton />,
})
```

## SEO Best Practices

### 1. Dynamic Metadata
```typescript
export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle)
  
  return {
    title: `${product.title} | Store Name`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image.url],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.image.url],
    },
  }
}
```

### 2. Structured Data (JSON-LD)
```typescript
export function ProductStructuredData({ product }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.edges[0]?.node.url,
    offers: {
      '@type': 'Offer',
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

### 3. Semantic HTML
```typescript
// Use proper HTML elements
<article>
  <header>
    <h1>{product.title}</h1>
  </header>
  <main>
    <section aria-label="Product images">
      {/* Images */}
    </section>
    <section aria-label="Product details">
      {/* Details */}
    </section>
  </main>
</article>
```

## Accessibility

### 1. Keyboard Navigation
```typescript
// Ensure all interactive elements are keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
  aria-label="Add to cart"
>
  Add to Cart
</button>
```

### 2. ARIA Labels
```typescript
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a role="menuitem" href="/products">Products</a>
    </li>
  </ul>
</nav>
```

### 3. Focus Management
```typescript
// Manage focus in modals
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
  }
}, [isOpen])
```

## Cart Best Practices

### 1. Optimistic Updates
```typescript
// Use useOptimistic for instant feedback
const [optimisticCart, setOptimisticCart] = useOptimistic(cart)

const addItem = async (variantId) => {
  // Optimistically update UI
  setOptimisticCart(optimisticAddItem(cart, variantId))
  
  // Then update server
  const newCart = await addToCart(variantId)
  setCart(newCart)
}
```

### 2. Error Handling
```typescript
try {
  await addItem(variantId)
  toast.success('Added to cart!')
} catch (error) {
  toast.error('Failed to add item. Please try again.')
  // Revert optimistic update
  setCart(previousCart)
}
```

### 3. Persistence
```typescript
// Save cart ID to localStorage
useEffect(() => {
  if (cart?.id) {
    localStorage.setItem('cartId', cart.id)
  }
}, [cart])

// Load cart on mount
useEffect(() => {
  const cartId = localStorage.getItem('cartId')
  if (cartId) {
    loadCart(cartId)
  }
}, [])
```

## Security

### 1. Environment Variables
```typescript
// Never expose sensitive data
// ✅ Good: Server-side only
const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN

// ❌ Bad: Client-side exposure
const token = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN
```

### 2. Input Validation
```typescript
import { z } from 'zod'

const productSchema = z.object({
  handle: z.string().min(1).max(255),
  quantity: z.number().int().positive().max(100),
})

const validatedData = productSchema.parse(userInput)
```

### 3. Rate Limiting
```typescript
// Implement rate limiting for API routes
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }
  
  // Process request
}
```

## Error Handling

### 1. Error Boundaries
```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error('Error:', error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### 2. Graceful Degradation
```typescript
// Handle missing data gracefully
const product = await getProduct(handle)

if (!product) {
  notFound() // Shows 404 page
}

// Or provide fallback
const image = product.images?.edges?.[0]?.node || {
  url: '/placeholder.jpg',
  altText: 'Product image',
}
```

## Testing

### 1. Unit Tests
```typescript
import { render, screen } from '@testing-library/react'
import { ProductCard } from './product-card'

test('displays product title', () => {
  const product = { title: 'Test Product', handle: 'test' }
  render(<ProductCard product={product} />)
  expect(screen.getByText('Test Product')).toBeInTheDocument()
})
```

### 2. E2E Tests
```typescript
// Using Playwright
import { test, expect } from '@playwright/test'

test('add to cart flow', async ({ page }) => {
  await page.goto('/products/test-product')
  await page.click('text=Add to Cart')
  await expect(page.locator('[aria-label="Cart"]')).toContainText('1')
})
```

## Monitoring

### 1. Analytics
```typescript
// Track user interactions
'use client'

export function AddToCartButton({ productId }) {
  const handleClick = () => {
    // Track event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        items: [{ id: productId }],
      })
    }
    addToCart(productId)
  }
  
  return <button onClick={handleClick}>Add to Cart</button>
}
```

### 2. Performance Monitoring
```typescript
// Use Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

## Summary

✅ **Performance**: Server Components, caching, image optimization  
✅ **SEO**: Dynamic metadata, structured data, semantic HTML  
✅ **Accessibility**: Keyboard navigation, ARIA labels, focus management  
✅ **Security**: Environment variables, input validation, rate limiting  
✅ **Error Handling**: Error boundaries, graceful degradation  
✅ **Testing**: Unit tests, E2E tests  
✅ **Monitoring**: Analytics, performance tracking  

Following these practices ensures a fast, accessible, and maintainable ecommerce store!

