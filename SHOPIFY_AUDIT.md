# Shopify Integration Audit Report

## 1. Shopify Layer Location

**Path:** `/lib/shopify/`

### Files Structure:
- `lib/shopify/fetch.ts` - Core GraphQL fetch wrapper
- `lib/shopify/queries.ts` - All GraphQL queries and mutations
- `lib/shopify/types.ts` - TypeScript type definitions
- `lib/shopify/index.ts` - Public API exports

## 2. Shopify Fetch Function

**File:** `lib/shopify/fetch.ts`

**Function:** `shopifyFetch<T>({ query, variables, cache })`

**Details:**
- Endpoint: `https://${domain}/api/2024-01/graphql.json`
- API Version: `2024-01`
- Auth: `X-Shopify-Storefront-Access-Token` header
- Env Vars: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- Default Cache: `'force-cache'`
- Error Handling: Throws on GraphQL errors
- Server-Only: ✅ Uses `process.env` (not exposed to client)

## 3. Available Functions (from `lib/shopify/index.ts`)

### Query Functions:
- `getMenu(handle: string)` → `ShopifyMenu | null`
- `getProduct(handle: string)` → `ShopifyProduct | null` (cache: 'no-store')
- `getProducts({ query?, first })` → `{ products, pageInfo }` (cache: 'force-cache')
- `getCollection(handle, first, after?)` → `ShopifyCollection | null` (cache: 'force-cache')
- `getCollections(first)` → `ShopifyCollection[]` (cache: 'force-cache')

### Cart Functions:
- `createCart(variantId, quantity)` → `ShopifyCart | null` (cache: 'no-store')
- `addToCart(cartId, variantId, quantity)` → `ShopifyCart | null` (cache: 'no-store')
- `updateCart(cartId, lineId, quantity)` → `ShopifyCart | null` (cache: 'no-store')
- `removeFromCart(cartId, lineId)` → `ShopifyCart | null` (cache: 'no-store')
- `getCart(cartId)` → `ShopifyCart | null` (cache: 'no-store')

## 4. Caching Strategy

**Current Implementation:**
- **Products/Collections:** `cache: 'force-cache'` (default)
- **Product Detail:** `cache: 'no-store'` (always fresh)
- **Cart Operations:** `cache: 'no-store'` (always fresh)
- **No Tag-Based Revalidation:** Currently not implemented

**Recommendation:** Add tag-based revalidation for better cache control:
- Products: `['shopify:products']`
- Collections: `['shopify:collections']`
- Individual Product: `['shopify:product:${handle}']`

## 5. Auth & Cart Handling

**Auth:**
- Token stored in `process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN` (server-only)
- Never exposed to client ✅
- Used in `shopifyFetch` wrapper only ✅

**Cart:**
- Cart ID stored in `localStorage` (client-side)
- Cart operations use cart ID from localStorage
- Cart functions are server-only but called from client component ⚠️

## 6. Usage Analysis

### ✅ Correct Usage (Server Components):
- `app/products/[handle]/page.tsx` → Uses `getProduct()` (Server Component)
- `app/search/page.tsx` → Uses `getCollections()` (Server Component)
- `components/home/featured-products.tsx` → Uses `getProducts()` (Server Component)
- `components/home/featured-categories.tsx` → Uses `getCollections()` (Server Component)
- `app/sitemap.ts` → Uses `getProducts()`, `getCollections()` (Server)

### ⚠️ Issue Found (Client Component):
- `components/cart/cart-provider.tsx` → Client component calling server-only functions
  - Calls: `getCart()`, `addToCart()`, `updateCart()`, `removeFromCart()`, `createCart()`
  - **Problem:** Client components cannot directly call server-only functions that use `process.env`
  - **Solution:** Create Server Actions to wrap these calls

### ⚠️ Issue Found (Client Component):
- `app/search/search-client.tsx` → Client component calling server-only functions
  - Calls: `getCollection()`, `getProducts()`
  - **Problem:** Same issue - client component calling server-only functions
  - **Solution:** Move data fetching to Server Component, pass data as props

## 7. No Direct Shopify Fetch Calls Found

✅ **Verified:** No direct `fetch()` calls to Shopify outside the Shopify layer
- Only `lib/shopify/fetch.ts` contains Shopify fetch logic
- All components use exported functions from `lib/shopify/index.ts`

## 8. Type Safety

✅ **Types are centralized:**
- All types in `lib/shopify/types.ts`
- No `any` types in Shopify layer
- Proper TypeScript interfaces for all Shopify data structures

## 9. Environment Variables

**Current Structure:**
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_APP_URL=http://localhost:3000
REVALIDATE_SECRET=your-secret
```

✅ **No changes needed** - Structure is correct

## 10. Issues to Fix

### Critical:
1. **Cart Provider** - Client component calling server-only functions
   - Need Server Actions wrapper

2. **Search Client** - Client component calling server-only functions  
   - Should fetch data in Server Component parent

### Recommendations:
1. Add tag-based revalidation for better cache control
2. Add retry logic for failed requests
3. Add request deduplication for concurrent requests


