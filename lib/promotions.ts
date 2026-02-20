/**
 * Server-only: fetch active Shopify discounts via Admin API.
 * Used by /api/promotions and PromoBanner. Never expose Admin token to client.
 */

const ADMIN_API_VERSION = "2024-01"

export type PromoKind = "deal" | "free_shipping" | "bxgy" | "other"

export interface PromoItem {
  kind: PromoKind
  title: string
  summary: string
  startsAt: string | null
  endsAt: string | null
}

export interface PromotionsResponse {
  hasActivePromos: boolean
  promos: PromoItem[]
}

function kindFromTypename(typename: string): PromoKind {
  const t = (typename || "").toLowerCase()
  if (t.includes("freeshipping")) return "free_shipping"
  if (t.includes("bxgy")) return "bxgy"
  return "deal"
}

/**
 * Fetches active discounts from Shopify Admin API and normalizes for storefront.
 * Cached 120s; invalidate with revalidateTag("promotions").
 */
export async function getPromotions(): Promise<PromotionsResponse> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

  if (!domain || !token) {
    return { hasActivePromos: false, promos: [] }
  }

  const query = `
    query {
      discountNodes(first: 100, query: "status:active") {
        edges {
          node {
            id
            __typename
            discount {
              __typename
              ... on DiscountCodeBasic {
                title
                summary
                status
                startsAt
                endsAt
              }
              ... on DiscountCodeFreeShipping {
                title
                summary
                status
                startsAt
                endsAt
              }
              ... on DiscountCodeBxgy {
                title
                summary
                status
                startsAt
                endsAt
              }
              ... on DiscountAutomaticBasic {
                title
                summary
                status
                startsAt
                endsAt
              }
              ... on DiscountAutomaticFreeShipping {
                title
                summary
                status
                startsAt
                endsAt
              }
              ... on DiscountAutomaticBxgy {
                title
                summary
                status
                startsAt
                endsAt
              }
            }
          }
        }
      }
    }
  `

  const url = `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 120, tags: ["promotions"] },
    })

    const json = await res.json()

    if (json.errors) {
      console.error("[promotions] GraphQL errors:", json.errors)
      return { hasActivePromos: false, promos: [] }
    }

    const edges = json.data?.discountNodes?.edges ?? []
    const promos: PromoItem[] = []

    for (const edge of edges) {
      const node = edge?.node
      const discount = node?.discount
      if (!discount || discount.status !== "ACTIVE") continue

      const title = discount.title ?? ""
      const summary = typeof discount.summary === "string" ? discount.summary : ""
      const startsAt = discount.startsAt ?? null
      const endsAt = discount.endsAt ?? null
      const kind = kindFromTypename(discount.__typename ?? node.__typename ?? "")

      promos.push({ kind, title, summary, startsAt, endsAt })
    }

    return {
      hasActivePromos: promos.length > 0,
      promos,
    }
  } catch (err) {
    console.error("[promotions]", err)
    return { hasActivePromos: false, promos: [] }
  }
}
