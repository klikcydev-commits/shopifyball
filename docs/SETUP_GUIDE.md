# Complete Next.js Ecommerce Setup Guide

A comprehensive guide to building a high-performance, SEO-friendly ecommerce store with Next.js, Shopify, HeadlessUI, and Tailwind CSS.

## Table of Contents

1. [Next.js Project Setup](#1-nextjs-project-setup)
2. [Connecting Shopify as Headless CMS](#2-connecting-shopify-as-headless-cms)
3. [Using HeadlessUI for Accessible Components](#3-using-headlessui-for-accessible-components)
4. [Styling with Tailwind CSS](#4-styling-with-tailwind-css)
5. [Fetching and Displaying Products](#5-fetching-and-displaying-products)
6. [Cart Functionality](#6-cart-functionality)
7. [Best Practices for Performance & SEO](#7-best-practices-for-performance--seo)

---

## 1. Next.js Project Setup

### Initial Setup

```bash
# Create Next.js project
npx create-next-app@latest my-ecommerce-store --typescript --tailwind --app

# Navigate to project
cd my-ecommerce-store

# Install additional dependencies
npm install @headlessui/react @heroicons/react
npm install @shopify/storefront-api-client
npm install framer-motion
npm install sonner
npm install class-variance-authority clsx tailwind-merge
```

### Project Structure

```
my-ecommerce-store/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── search/
│   │   └── page.tsx        # Product listing
│   ├── products/
│   │   └── [handle]/
│   │       └── page.tsx    # Product detail
│   ├── api/
│   │   └── revalidate/    # Webhook endpoint
│   ├── robots.ts           # SEO robots.txt
│   └── sitemap.ts          # SEO sitemap
├── components/
│   ├── layout/             # Header, Footer
│   ├── cart/               # Cart components
│   ├── product/            # Product components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── shopify/            # Shopify integration
│   └── utils.ts            # Utilities
└── public/                 # Static assets
```

### Next.js Configuration

**`next.config.js`:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.shopify.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
```

### TypeScript Configuration

**`tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 2. Connecting Shopify as Headless CMS

### Getting Shopify Credentials

1. **Go to Shopify Admin** → Settings → Apps and sales channels
2. **Develop apps** → Create a new app
3. **Enable Storefront API** with these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
4. **Install app** and copy the Storefront API access token

### Environment Variables

Create `.env.local`:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=your-private-storefront-token
SHOPIFY_API_VERSION=2024-01
NEXT_PUBLIC_APP_URL=http://localhost:3000
REVALIDATE_SECRET=your-secret-token
```

### Shopify Fetch Function

**`lib/shopify/fetch.ts`:**

```typescript
type Variables = Record<string, any>

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
}: {
  query: string
  variables?: Variables
  cache?: RequestCache
}): Promise<{ status: number; body: T } | never> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const storefrontPrivateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01'

  if (!domain || !storefrontPrivateToken) {
    throw new Error('Missing Shopify environment variables')
  }

  try {
    const result = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontPrivateToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    })

    const body = await result.json()

    if (body.errors) {
      throw body.errors[0]
    }

    return {
      status: result.status,
      body,
    }
  } catch (e) {
    throw {
      status: 500,
      message: e instanceof Error ? e.message : 'Error fetching data',
      query,
    }
  }
}
```

### GraphQL Queries

**`lib/shopify/queries.ts`:**

```typescript
export const getProductsQuery = `
  query getProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`

export const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
      options {
        id
        name
        values
      }
    }
  }
`

export const getCollectionQuery = `
  query getCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`
```

### Helper Functions

**`lib/shopify/index.ts`:**

```typescript
import { shopifyFetch } from './fetch'
import { getProductsQuery, getProductQuery, getCollectionQuery } from './queries'

export async function getProducts({
  query,
  first = 12,
}: {
  query?: string
  first?: number
}) {
  const res = await shopifyFetch({
    query: getProductsQuery,
    variables: { query, first },
  })

  return {
    products: res.body.data.products.edges.map((edge: any) => edge.node),
    pageInfo: res.body.data.products.pageInfo,
  }
}

export async function getProduct(handle: string) {
  const res = await shopifyFetch({
    query: getProductQuery,
    variables: { handle },
    cache: 'no-store',
  })

  return res.body.data.product
}

export async function getCollection(handle: string, first: number = 12) {
  const res = await shopifyFetch({
    query: getCollectionQuery,
    variables: { handle, first },
  })

  return res.body.data.collection
}
```

---

## 3. Using HeadlessUI for Accessible Components

### Installation

```bash
npm install @headlessui/react @heroicons/react
```

### Modal/Dialog Example

```typescript
'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-end p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="w-full max-w-md bg-white shadow-xl h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <Dialog.Title className="text-xl font-bold">Shopping Cart</Dialog.Title>
                <button onClick={onClose}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              {/* Cart content */}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
```

### Dropdown Menu Example

```typescript
'use client'

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

export function DropdownMenu() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2">
        Menu
        <ChevronDownIcon className="w-4 h-4" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm`}
                >
                  Account settings
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm`}
                >
                  Sign out
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
```

### Disclosure (Accordion) Example

```typescript
'use client'

import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

export function Accordion() {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium">
            <span>What is your refund policy?</span>
            <ChevronUpIcon
              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
            If you're unhappy with your purchase, we'll refund you in full within 30 days.
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
```

---

## 4. Styling with Tailwind CSS

### Tailwind Configuration

**`tailwind.config.ts`:**

```typescript
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your brand colors
        navy: {
          DEFAULT: '#0A1931',
          light: '#1A3D63',
          dark: '#050A15',
        },
        gold: {
          DEFAULT: '#4A7FA7',
          light: '#B3CFE5',
        },
        cream: '#F6FAFD',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Oswald', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config
```

### Global Styles

**`app/globals.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 207 50% 98%;
    --foreground: 215 66% 12%;
    /* Add your CSS variables */
  }
}

@layer components {
  .container-custom {
    @apply container mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .section-padding {
    @apply py-16 md:py-24 lg:py-32;
  }
}
```

### Responsive Design Patterns

```typescript
// Mobile-first approach
<div className="
  grid 
  grid-cols-1           // Mobile: 1 column
  sm:grid-cols-2        // Small: 2 columns
  lg:grid-cols-3        // Large: 3 columns
  xl:grid-cols-4        // Extra large: 4 columns
  gap-4
">
  {/* Content */}
</div>

// Responsive typography
<h1 className="
  text-3xl              // Mobile
  md:text-4xl           // Medium
  lg:text-5xl           // Large
  font-heading
">
  Title
</h1>
```

---

## 5. Fetching and Displaying Products

### Server Component for Product Listing

**`app/search/page.tsx`:**

```typescript
import { Suspense } from 'next'
import { getProducts, getCollections } from '@/lib/shopify'
import { ProductCard } from '@/components/product/product-card'
import { FilterList } from '@/components/search/filter-list'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const collectionHandle = typeof searchParams.collection === 'string' 
    ? searchParams.collection 
    : undefined

  // Fetch data in parallel
  const [productsResult, collections] = await Promise.all([
    getProducts({ query, first: 24 }),
    getCollections(20),
  ])

  return (
    <div className="container-custom py-16">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="lg:w-64">
          <FilterList collections={collections} />
        </aside>

        {/* Products */}
        <div className="flex-1">
          <Suspense fallback={<ProductSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsResult.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
```

### Product Card Component

**`components/product/product-card.tsx`:**

```typescript
import Link from 'next/link'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const image = product.images?.edges?.[0]?.node
  const price = product.priceRange.minVariantPrice

  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-gray-900 font-bold">
            ${parseFloat(price.amount).toFixed(2)} {price.currencyCode}
          </p>
        </div>
      </div>
    </Link>
  )
}
```

### Product Detail Page

**`app/products/[handle]/page.tsx`:**

```typescript
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/shopify'
import { ProductDetails } from '@/components/product/product-details'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { handle: string }
}): Promise<Metadata> {
  const product = await getProduct(params.handle)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.title} | Store`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.edges[0]?.node.url
        ? [{ url: product.images.edges[0].node.url }]
        : [],
    },
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
```

---

## 6. Cart Functionality

### Cart Provider with useOptimistic

**`components/cart/cart-provider.tsx`:**

```typescript
'use client'

import { createContext, useContext, useOptimistic, useTransition, useEffect, useState } from 'react'
import { getCart, addToCart, updateCart, removeFromCart, createCart } from '@/lib/shopify'
import type { ShopifyCart } from '@/lib/shopify/types'

interface CartContextType {
  cart: ShopifyCart | null
  isLoading: boolean
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [optimisticCart, setOptimisticCart] = useOptimistic<ShopifyCart | null>(cart)
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null
    if (cartId) {
      refreshCart(cartId)
    } else {
      setIsLoading(false)
    }
  }, [])

  const refreshCart = async (cartId: string) => {
    try {
      const updatedCart = await getCart(cartId)
      setCart(updatedCart)
      if (updatedCart && typeof window !== 'undefined') {
        localStorage.setItem('cartId', updatedCart.id)
      }
    } catch (error) {
      console.error('Error refreshing cart:', error)
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (variantId: string, quantity: number = 1) => {
    startTransition(async () => {
      try {
        const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null
        let updatedCart: ShopifyCart | null

        if (cartId) {
          updatedCart = await addToCart(cartId, variantId, quantity)
        } else {
          updatedCart = await createCart(variantId, quantity)
        }

        if (updatedCart) {
          setCart(updatedCart)
          if (typeof window !== 'undefined') {
            localStorage.setItem('cartId', updatedCart.id)
          }
        }
      } catch (error) {
        console.error('Error adding item to cart:', error)
        throw error
      }
    })
  }

  const updateItem = async (lineId: string, quantity: number) => {
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null
    if (!cartId) return

    startTransition(async () => {
      try {
        const updatedCart = await updateCart(cartId, lineId, quantity)
        if (updatedCart) {
          setCart(updatedCart)
        }
      } catch (error) {
        console.error('Error updating cart item:', error)
        throw error
      }
    })
  }

  const removeItem = async (lineId: string) => {
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null
    if (!cartId) return

    startTransition(async () => {
      try {
        const updatedCart = await removeFromCart(cartId, lineId)
        if (updatedCart) {
          setCart(updatedCart)
        } else {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('cartId')
          }
          setCart(null)
        }
      } catch (error) {
        console.error('Error removing cart item:', error)
        throw error
      }
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        isLoading: isLoading || isPending,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
```

---

## 7. Best Practices for Performance & SEO

### 1. Server Components by Default

```typescript
// ✅ Good: Server Component
export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle)
  return <ProductDetails product={product} />
}

// ❌ Avoid: Client Component for data fetching
'use client'
export default function ProductPage() {
  const [product, setProduct] = useState(null)
  useEffect(() => {
    fetchProduct().then(setProduct)
  }, [])
  // ...
}
```

### 2. Use Suspense for Loading States

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductList />
    </Suspense>
  )
}
```

### 3. Optimize Images

```typescript
import Image from 'next/image'

<Image
  src={product.image.url}
  alt={product.title}
  width={500}
  height={500}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>
```

### 4. Dynamic Metadata

```typescript
export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProduct(params.handle)
  
  return {
    title: `${product.title} | Store`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image.url],
    },
  }
}
```

### 5. Static Generation with Revalidation

```typescript
// Revalidate every hour
export const revalidate = 3600

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductList products={products} />
}
```

### 6. Sitemap Generation

**`app/sitemap.ts`:**

```typescript
import { MetadataRoute } from 'next'
import { getProducts, getCollections } from '@/lib/shopify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourstore.com'
  
  const [products, collections] = await Promise.all([
    getProducts({ first: 1000 }),
    getCollections(50),
  ])

  const productRoutes = products.products.map((product) => ({
    url: `${baseUrl}/products/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const collectionRoutes = collections.map((collection) => ({
    url: `${baseUrl}/search?collection=${collection.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...productRoutes,
    ...collectionRoutes,
  ]
}
```

### 7. Webhooks for Revalidation

**`app/api/revalidate/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const path = request.nextUrl.searchParams.get('path')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (!path) {
    return NextResponse.json({ message: 'Path is required' }, { status: 400 })
  }

  try {
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
```

### 8. Error Handling

**`app/error.tsx`:**

```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

### 9. Performance Monitoring

```typescript
// Use Next.js built-in analytics
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 10. Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Only load on client if needed
})
```

---

## Summary

✅ **Next.js App Router** for server-side rendering and optimal performance  
✅ **Shopify Storefront API** for headless commerce  
✅ **HeadlessUI** for accessible, unstyled components  
✅ **Tailwind CSS** for rapid, responsive styling  
✅ **Server Components** by default for better performance  
✅ **useOptimistic** for instant UI updates  
✅ **Dynamic metadata** for SEO  
✅ **Webhooks** for content revalidation  

This setup provides a solid foundation for a fast, SEO-friendly, and scalable ecommerce store!

