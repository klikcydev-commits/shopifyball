/**
 * Server-only Shopify GraphQL fetch wrapper.
 * This function MUST only be called from server-side code (RSC, Server Actions, Route Handlers).
 * The private storefront token is never exposed to the client.
 */
type Variables = Record<string, unknown>

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
    const missingVars = []
    if (!domain) missingVars.push('SHOPIFY_STORE_DOMAIN')
    if (!storefrontToken) missingVars.push('SHOPIFY_STOREFRONT_ACCESS_TOKEN')
    
    const error = new Error(
      `Missing Shopify environment variables: ${missingVars.join(' and ')} are required. Please check your .env.local file.`
    )
    ;(error as Error & { code?: string }).code = 'MISSING_ENV_VARS'
    throw error
  }
  
  // Only log token length in development to avoid exposing sensitive info
  if (process.env.NODE_ENV === 'development') {
    console.log('[Shopify] Token length:', storefrontToken?.length)
  }

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

    if (!result.ok) {
      const errorText = await result.text()
      console.error('[Shopify] HTTP Error:', result.status, errorText)
      throw new Error(`Shopify API returned ${result.status}: ${errorText.substring(0, 200)}`)
    }

    const body = await result.json()

    if (body.errors) {
      console.error('[Shopify] GraphQL Error:', JSON.stringify(body.errors, null, 2))
      const firstError = body.errors[0]
      const errorMessage = firstError?.message || JSON.stringify(firstError)
      const error = new Error(`Shopify GraphQL Error: ${errorMessage}`)
      ;(error as Error & { status?: number; code?: string }).status = result.status
      ;(error as Error & { status?: number; code?: string }).code = firstError?.extensions?.code
      throw error
    }

    return {
      status: result.status,
      body,
    }
  } catch (e: unknown) {
    console.error('[Shopify] Fetch Error:', e instanceof Error ? e.message : String(e))
    if (e instanceof Error) {
      // Preserve the original error if it's already an Error
      ;(e as Error & { status?: number }).status = (e as Error & { status?: number }).status || 500
      throw e
    }
    const errorMessage = e instanceof Error ? e.message : 'Error fetching data from Shopify'
    const error = new Error(errorMessage)
    ;(error as Error & { status?: number }).status = 500
    throw error
  }
}

