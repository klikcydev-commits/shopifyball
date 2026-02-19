/**
 * Shopify Admin API helpers (optional).
 * Requires in .env.local:
 *   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
 * Used to update product variant compareAtPrice/price when discounts change.
 */

const getAdminConfig = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
  if (!domain || !token) return null
  return { domain, token }
}

const ADMIN_API_VERSION = "2024-01"

export interface ProductVariantUpdateResult {
  productVariant: { id: string; price: string; compareAtPrice: string | null } | null
  userErrors: Array<{ field: string[]; message: string }>
}

/**
 * Update a product variant's price and/or compare-at price via Admin API.
 * Use when you want to set compare-at programmatically (e.g. when a discount goes live).
 */
export async function updateProductVariantPrice(
  variantId: string,
  options: { price?: string; compareAtPrice?: string | null }
): Promise<ProductVariantUpdateResult> {
  const config = getAdminConfig()
  if (!config) {
    return {
      productVariant: null,
      userErrors: [{ field: [], message: "SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN must be set" }],
    }
  }

  const input: { id: string; price?: string; compareAtPrice?: string | null } = { id: variantId }
  if (options.price !== undefined) input.price = options.price
  if (options.compareAtPrice !== undefined) input.compareAtPrice = options.compareAtPrice

  const mutation = `
    mutation productVariantUpdate($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant {
          id
          price
          compareAtPrice
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const url = `https://${config.domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": config.token,
    },
    body: JSON.stringify({ query: mutation, variables: { input } }),
  })
  const json = await res.json()
  const data = json.data?.productVariantUpdate
  if (!data) return { productVariant: null, userErrors: [{ field: [], message: "Admin API request failed" }] }
  return { productVariant: data.productVariant, userErrors: data.userErrors ?? [] }
}
