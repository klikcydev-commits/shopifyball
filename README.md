# ShopifyBall - Next.js Ecommerce with Shopify

A high-performance, server-rendered Next.js App Router ecommerce application using Shopify as a headless CMS. Built with React Server Components, Server Actions, Suspense, useOptimistic, and more.

## Features

### 🚀 Performance
- ✅ Next.js 14 App Router with React Server Components
- ✅ Server-side rendering for optimal SEO
- ✅ Image optimization with Next.js Image
- ✅ Suspense for progressive loading
- ✅ Static generation with revalidation

### 🛒 Ecommerce
- ✅ Shopify Storefront API integration (headless CMS)
- ✅ Product listings and detail pages
- ✅ Collection/Category browsing
- ✅ Shopping cart with localStorage persistence
- ✅ Optimistic UI updates with `useOptimistic`
- ✅ Server Actions for cart operations

### 🎨 UI/UX
- ✅ HeadlessUI for accessible components
- ✅ Tailwind CSS with custom branding
- ✅ Responsive design (mobile-first)
- ✅ Modern animations with Framer Motion
- ✅ Toast notifications with Sonner

### 🔍 SEO & Best Practices
- ✅ Dynamic metadata generation
- ✅ Automatic sitemap.xml
- ✅ robots.txt configuration
- ✅ Open Graph tags
- ✅ Error boundaries and 404 pages
- ✅ TypeScript for type safety

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICK_START.md)** - Get up and running in 5 minutes
- **[Complete Setup Guide](./docs/SETUP_GUIDE.md)** - Comprehensive guide covering:
  - Next.js project setup
  - Shopify headless CMS integration
  - HeadlessUI components
  - Tailwind CSS styling
  - Product fetching and display
  - Cart functionality
  - Performance & SEO best practices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Shopify store with Storefront API access

### Quick Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd football
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Shopify Storefront API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=your-private-storefront-token
SHOPIFY_API_VERSION=2024-01

# Optional: For webhooks
SHOPIFY_ADMIN_API_KEY=your-admin-api-key
SHOPIFY_ADMIN_API_SECRET=your-admin-api-secret
REVALIDATE_SECRET=your-secret-token

# App URL (for webhooks and sitemap)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting Shopify Credentials

1. **Storefront API Access Token:**
   - Go to your Shopify Admin
   - Navigate to Settings > Apps and sales channels > Develop apps
   - Create a new app or use an existing one
   - Enable Storefront API
   - Install the app and copy the Storefront API access token

2. **Store Domain:**
   - Your store domain is: `your-store-name.myshopify.com`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── search/             # Search/Collection page
│   ├── products/           # Product pages
│   ├── api/                # API routes
│   ├── robots.ts           # SEO robots.txt
│   ├── sitemap.ts          # SEO sitemap
│   └── error.tsx           # Error boundary
├── components/              # React components
│   ├── layout/             # Header, Footer
│   ├── cart/               # Cart functionality
│   ├── product/            # Product components
│   ├── search/             # Search/Filter components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities and Shopify integration
│   ├── shopify/            # Shopify API functions
│   │   ├── fetch.ts        # GraphQL fetch utility
│   │   ├── queries.ts      # GraphQL queries
│   │   ├── types.ts        # TypeScript types
│   │   └── index.ts        # Main Shopify functions
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## Shopify Integration

### GraphQL Queries

The app uses Shopify's Storefront API with GraphQL. All queries are defined in `lib/shopify/queries.ts`.

### Available Functions

- `getProduct(handle)` - Get a single product
- `getProducts({ query, first })` - Get multiple products
- `getCollection(handle, first, after)` - Get a collection
- `getCollections(first)` - Get all collections
- `getMenu(handle)` - Get navigation menu
- `createCart(variantId, quantity)` - Create a new cart
- `addToCart(cartId, variantId, quantity)` - Add item to cart
- `updateCart(cartId, lineId, quantity)` - Update cart item
- `removeFromCart(cartId, lineId)` - Remove item from cart
- `getCart(cartId)` - Get cart details

## Cart Functionality

The cart uses:
- **Server Actions** for mutations
- **useOptimistic** for instant UI updates
- **localStorage** for cart persistence
- **CartProvider** context for state management

## Webhooks & Revalidation

Set up Shopify webhooks to revalidate pages when products/collections change:

1. In Shopify Admin, go to Settings > Notifications > Webhooks
2. Create webhooks for:
   - Product updates
   - Collection updates
3. Point them to: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET&path=/search`

## Styling

The app uses Tailwind CSS with custom branding colors:
- **Midnight Navy** (#0A1931) - Primary dark / Foreground
- **Deep Ocean** (#1A3D63) - Navy light / Secondary dark
- **Steel Blue** (#4A7FA7) - Accent color / Primary accent
- **Powder Sky** (#B3CFE5) - Light accent / Secondary / Borders
- **Ice White** (#F6FAFD) - Background / Primary light

## SEO

- Dynamic metadata for products and pages
- Automatic sitemap generation
- robots.txt configuration
- Open Graph tags

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Troubleshooting

### Cart not persisting
- Check that localStorage is enabled in the browser
- Verify cart ID is being saved correctly

### Products not loading
- Verify Shopify credentials in `.env.local`
- Check Storefront API permissions
- Ensure products are published in Shopify

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install --legacy-peer-deps`

## License

MIT
