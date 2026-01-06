import { NextResponse } from 'next/server'
import { getMenu, getProducts, getCollections } from '@/lib/shopify'

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('=== SHOPIFY TEST API ===')
  console.log('Domain:', process.env.SHOPIFY_STORE_DOMAIN || 'NOT SET')
  console.log('Has Token:', !!process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN)
  console.log('API Version:', process.env.SHOPIFY_API_VERSION || '2024-01')
  
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      domain: process.env.SHOPIFY_STORE_DOMAIN || 'NOT SET',
      hasToken: !!process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN,
      apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01',
    },
    tests: {},
  }

  // Test 1: Fetch menu
  try {
    console.log('Fetching menu...')
    const menu = await getMenu('main-menu')
    console.log('Menu result:', JSON.stringify(menu, null, 2))
    results.tests = {
      ...results.tests as object,
      menu: {
        success: true,
        data: menu,
      },
    }
  } catch (error) {
    console.error('Menu error:', error)
    results.tests = {
      ...results.tests as object,
      menu: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }

  // Test 2: Fetch products
  try {
    console.log('Fetching products...')
    const { products } = await getProducts({ first: 3 })
    console.log('Products count:', products.length)
    results.tests = {
      ...results.tests as object,
      products: {
        success: true,
        count: products.length,
        titles: products.map(p => p.title),
      },
    }
  } catch (error) {
    console.error('Products error:', error)
    results.tests = {
      ...results.tests as object,
      products: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }

  // Test 3: Fetch collections
  try {
    console.log('Fetching collections...')
    const collections = await getCollections(5)
    console.log('Collections count:', collections.length)
    results.tests = {
      ...results.tests as object,
      collections: {
        success: true,
        count: collections.length,
        titles: collections.map(c => c.title),
      },
    }
  } catch (error) {
    console.error('Collections error:', error)
    results.tests = {
      ...results.tests as object,
      collections: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }

  console.log('=== TEST RESULTS ===')
  console.log(JSON.stringify(results, null, 2))
  
  return NextResponse.json(results, { status: 200 })
}

