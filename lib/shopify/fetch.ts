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
  const storefrontPrivateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01'

  if (!domain || !storefrontPrivateToken) {
    throw new Error(
      'Missing Shopify environment variables: SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_PRIVATE_TOKEN are required'
    )
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

