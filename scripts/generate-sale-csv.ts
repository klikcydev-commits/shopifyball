/**
 * Generates Shopify CSV update files to set Compare-at price so sale UI appears on product cards.
 * Run from project root: npx tsx scripts/generate-sale-csv.ts
 * Requires .env.local with SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import {
  COMPARE_AT_PRICE,
  VARIANT_PRICE,
  SALE_ALL_COLLECTION_MATCH,
  SALE_SELECTED_HANDLES,
} from './sale-csv-config'

// Load .env.local into process.env
function loadEnvLocal() {
  const path = join(process.cwd(), '.env.local')
  if (!existsSync(path)) {
    console.warn('.env.local not found; ensure Shopify env vars are set.')
    return
  }
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
}

loadEnvLocal()

type ProductRow = {
  handle: string
  title: string
  option1Name: string
  option1Value: string
  price: string
  compareAtPrice: string
}

const CSV_HEADERS = ['Handle', 'Title', 'Option1 Name', 'Option1 Value', 'Price', 'Compare-at price']

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function toCsvRow(row: ProductRow): string {
  return [
    escapeCsv(row.handle),
    escapeCsv(row.title),
    escapeCsv(row.option1Name),
    escapeCsv(row.option1Value),
    escapeCsv(row.price),
    escapeCsv(row.compareAtPrice),
  ].join(',')
}

function productToRows(product: {
  handle: string
  title: string
  variants: { edges: Array<{ node: { title: string; price: { amount: string }; compareAtPrice?: { amount: string } | null; selectedOptions: Array<{ name: string; value: string }> } }> }
  options?: Array<{ name: string; values: string[] }>
}): ProductRow[] {
  const option1Name = product.options?.[0]?.name ?? 'Title'
  const rows: ProductRow[] = []
  for (const edge of product.variants.edges) {
    const v = edge.node
    const option1Value = v.selectedOptions?.[0]?.value ?? v.title ?? 'Default Title'
    const price = VARIANT_PRICE !== '' ? VARIANT_PRICE : v.price?.amount ?? '60.00'
    rows.push({
      handle: product.handle,
      title: product.title,
      option1Name,
      option1Value,
      price,
      compareAtPrice: COMPARE_AT_PRICE,
    })
  }
  return rows
}

let getCollectionsFn: (first: number) => Promise<{ title: string; handle: string; products: { edges: Array<{ node: { handle: string } }>; pageInfo: { hasNextPage?: boolean; endCursor?: string } } }[]>
let getCollectionFn: (handle: string, first: number, after?: string) => Promise<{ products: { edges: Array<{ node: { handle: string } }>; pageInfo: { hasNextPage?: boolean; endCursor?: string } } } | null> | null
type ProductForRows = {
  handle: string
  title: string
  variants: { edges: Array<{ node: { title: string; price: { amount: string }; compareAtPrice?: { amount: string } | null; selectedOptions: Array<{ name: string; value: string }> } }> }
  options?: Array<{ name: string; values: string[] }>
}
let getProductFn: (handle: string) => Promise<ProductForRows | null>

async function fetchAllProductsFromCollections(): Promise<Set<string>> {
  const collections = await getCollectionsFn(50)
  const matchLower = SALE_ALL_COLLECTION_MATCH.map((s) => s.toLowerCase())
  const relevant = collections.filter(
    (c) => matchLower.some((m) => c.title.toLowerCase().includes(m) || c.handle.toLowerCase().includes(m))
  )
  const productHandles = new Set<string>()
  for (const col of relevant) {
    let after: string | undefined
    do {
      const data = await getCollectionFn(col.handle, 100, after)
      if (!data?.products) break
      for (const edge of data.products.edges) {
        productHandles.add(edge.node.handle)
      }
      const pageInfo = data.products.pageInfo as { hasNextPage?: boolean; endCursor?: string }
      if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
        after = pageInfo.endCursor
      } else {
        break
      }
    } while (after)
  }
  return productHandles
}

async function main() {
  const shopify = await import('../lib/shopify/index')
  getCollectionsFn = shopify.getCollections as typeof getCollectionsFn
  getCollectionFn = shopify.getCollection as typeof getCollectionFn
  getProductFn = shopify.getProduct as typeof getProductFn
  console.log('Fetching collections and products from Shopify...')
  const allHandles = await fetchAllProductsFromCollections()
  console.log(`Found ${allHandles.size} product handles in CR7 / Mbappe / Legends collections.`)

  const selectedFromFile: string[] = []
  const selectedPath = join(process.cwd(), 'scripts', 'selected-handles.txt')
  if (existsSync(selectedPath)) {
    const content = readFileSync(selectedPath, 'utf-8')
    for (const line of content.split('\n')) {
      const h = line.trim()
      if (h && !h.startsWith('#')) selectedFromFile.push(h)
    }
  }
  const selectedHandles = new Set([...SALE_SELECTED_HANDLES, ...selectedFromFile])

  const allRows: ProductRow[] = []
  const productByHandle = new Map<string, Parameters<typeof productToRows>[0]>()
  let count = 0
  for (const handle of allHandles) {
    const product = await getProductFn(handle)
    if (!product) continue
    count++
    productByHandle.set(handle, product)
    const rows = productToRows(product as Parameters<typeof productToRows>[0])
    allRows.push(...rows)
  }
  console.log(`Fetched ${count} products (${allRows.length} variant rows) for sale_all.`)

  // sale_selected: include products from selectedHandles (fetch if not already in productByHandle)
  const selectedRows: ProductRow[] = []
  for (const handle of selectedHandles) {
    let product: ProductForRows | null | undefined = productByHandle.get(handle)
    if (!product) {
      product = await getProductFn(handle)
      if (!product) continue
    }
    selectedRows.push(...productToRows(product))
  }

  const saleAllCsv = [CSV_HEADERS.join(','), ...allRows.map(toCsvRow)].join('\n')
  const saleSelectedCsv =
    selectedHandles.size > 0
      ? [CSV_HEADERS.join(','), ...selectedRows.map(toCsvRow)].join('\n')
      : [CSV_HEADERS.join(','), '# Add handles to sale-csv-config.ts SALE_SELECTED_HANDLES or scripts/selected-handles.txt'].join('\n')

  const outDir = join(process.cwd(), 'scripts', 'output')
  const { mkdirSync } = await import('fs')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const allPath = join(outDir, 'sale_all.csv')
  const selectedPathOut = join(outDir, 'sale_selected.csv')
  writeFileSync(allPath, saleAllCsv, 'utf-8')
  writeFileSync(selectedPathOut, saleSelectedCsv, 'utf-8')
  console.log(`Wrote ${allPath}`)
  console.log(`Wrote ${selectedPathOut}`)
  console.log('Import in Shopify: Products → Import → Overwrite products with matching handles.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
