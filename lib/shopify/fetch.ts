/**
 * Server-only Shopify GraphQL fetch wrapper.
 * This function MUST only be called from server-side code (RSC, Server Actions, Route Handlers).
 * The private storefront token is never exposed to the client.
 */
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
  // Use SHOPIFY_STOREFRONT_ACCESS_TOKEN (the public Storefront API token, NOT the Admin API shpat_ token)
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01'

  if (!domain || !storefrontToken) {
    throw new Error(
      'Missing Shopify environment variables: SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are required'
    )
  }
  
  console.log('[Shopify] Token length:', storefrontToken?.length)

  const url = `https://${domain}/api/${apiVersion}/graphql.json`
  console.log('[Shopify] Fetching:', url)

  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    })

    const body = await result.json()

    if (body.errors) {
      console.error('[Shopify] GraphQL Error:', JSON.stringify(body.errors, null, 2))
      throw body.errors[0]
    }

    return {
      status: result.status,
      body,
    }
  } catch (e: any) {
    console.error('[Shopify] Fetch Error:', e?.message || e)
    const errorMessage = e instanceof Error ? e.message : 'Error fetching data'
    const error = new Error(errorMessage)
    ;(error as any).status = 500
    throw error
  }
}

