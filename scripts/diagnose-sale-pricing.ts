/**
 * SALE PRICING DIAGNOSTIC SCRIPT
 * 
 * Run: npx tsx scripts/diagnose-sale-pricing.ts
 * 
 * Verifies:
 * 1. Shopify API returns compareAtPrice for products
 * 2. Adapter correctly maps compareAtPrice to Product type
 * 3. Sale helpers correctly identify sale products
 */

import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env.local
function loadEnvLocal() {
  const path = join(process.cwd(), '.env.local')
  try {
    const content = readFileSync(path, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const eq = trimmed.indexOf('=')
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim()
        const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
        process.env[key] = value
      }
    }
  }
  } catch (e) {
    console.warn('.env.local not found, checking environment...')
  }
}

loadEnvLocal()

async function main() {
  const { getProducts, getProduct } = await import('../lib/shopify/index')
  const { adaptShopifyProduct } = await import('../lib/shopify/adapter')
  const { getCardPricing, getSaleState } = await import('../lib/sale-helpers')

  console.log('\n=== SALE PRICING DIAGNOSTIC ===\n')

  // Fetch first 20 products
  console.log('Fetching products from Shopify...')
  const { products: rawProducts } = await getProducts({ first: 20 })
  console.log(`Fetched ${rawProducts.length} products\n`)

  // Check each product for compareAtPrice
  let saleCount = 0
  for (const raw of rawProducts) {
    const firstVariant = raw.variants?.edges?.[0]?.node || raw.variants?.nodes?.[0]
    const hasCompareAt = !!firstVariant?.compareAtPrice?.amount
    const price = firstVariant?.price?.amount || '0'
    const compareAt = firstVariant?.compareAtPrice?.amount || 'null'
    
    if (hasCompareAt) {
      saleCount++
      console.log(`✓ ${raw.handle}`)
      console.log(`  Title: ${raw.title}`)
      console.log(`  Price: ${price}`)
      console.log(`  Compare-at: ${compareAt}`)
      
      // Adapt and test sale helpers
      const adapted = adaptShopifyProduct(raw)
      console.log(`  Adapted Product.compareAtPrice: ${adapted.compareAtPrice || 'null'}`)
      console.log(`  Adapted Variant[0].compareAtPrice: ${adapted.variants[0]?.compareAtPrice || 'null'}`)
      
      // Get display variant (same logic as ProductCard)
      const displayVariant = adapted.variants?.find((v) => v.availableForSale) ?? adapted.variants?.[0] ?? null
      const variantForSale = displayVariant
        ? {
            price: displayVariant.price,
            compareAtPrice: displayVariant.compareAtPrice ?? undefined,
            currencyCode: displayVariant.currencyCode ?? adapted.currencyCode ?? 'AED',
          }
        : null
      
      const cardPricing = getCardPricing(variantForSale)
      const saleState = getSaleState(variantForSale)
      
      console.log(`  CardPricing.isSale: ${cardPricing.isSale}`)
      if (cardPricing.isSale) {
        console.log(`  CardPricing.price: ${cardPricing.price}`)
        console.log(`  CardPricing.compare: ${cardPricing.compare}`)
        console.log(`  SaleState.percentOff: ${saleState.percentOff}%`)
      } else {
        console.log(`  ❌ PROBLEM: Has compareAtPrice but cardPricing.isSale = false`)
        console.log(`     variantForSale:`, JSON.stringify(variantForSale, null, 2))
      }
      console.log('')
    }
  }

  console.log(`\n=== SUMMARY ===`)
  console.log(`Products with compareAtPrice: ${saleCount}/${rawProducts.length}`)
  
  if (saleCount === 0) {
    console.log('\n❌ NO SALE PRODUCTS FOUND')
    console.log('   → Check Shopify Admin: ensure products have "Compare at price" set')
    console.log('   → Ensure Compare at price > Price for at least one variant')
  } else {
    console.log('\n✓ Sale products found. If UI still not showing sale pricing:')
    console.log('  1. Check browser console for adapter logs (development mode)')
    console.log('  2. Verify ProductCard is using correct displayVariant logic')
    console.log('  3. Check CSS for hidden/opacity styles on sale elements')
  }
}

main().catch(console.error)
