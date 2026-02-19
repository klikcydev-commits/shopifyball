import { NextResponse } from "next/server"

const ADMIN_API_VERSION = "2024-01"

export interface ActiveDiscount {
  id: string
  title: string
  status: string
  percentage: number
  /** Shopify Collection GIDs (e.g. gid://shopify/Collection/123) */
  collectionIds: string[]
}

export interface ActiveDiscountsResponse {
  active: boolean
  discounts: ActiveDiscount[]
}

/**
 * GET /api/active-discounts
 * Fetches automatic discounts from Shopify Admin API and returns only ACTIVE ones.
 * Used to show/hide discount UI and compute discounted prices by collection.
 * Requires SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN in env.
 */
export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

  if (!domain || !token) {
    return NextResponse.json(
      { active: false, discounts: [], error: "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN" },
      { status: 200 }
    )
  }

  const query = `
    query {
      discountNodes(first: 50) {
        edges {
          node {
            id
            discount {
              ... on DiscountAutomaticBasic {
                title
                status
                startsAt
                endsAt
                customerGets {
                  value {
                    ... on DiscountPercentage {
                      percentage
                    }
                    ... on DiscountAmount {
                      amount {
                        amount
                        currencyCode
                      }
                    }
                  }
                  items {
                    ... on DiscountCollections {
                      collections(first: 20) {
                        edges {
                          node {
                            id
                            title
                          }
                        }
                      }
                    }
                    ... on DiscountProducts {
                      products(first: 50) {
                        edges {
                          node {
                            id
                            title
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const url = `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    })

    const json = await response.json()

    if (json.errors) {
      console.error("[active-discounts] GraphQL errors:", json.errors)
      return NextResponse.json({ active: false, discounts: [] }, { status: 200 })
    }

    const edges = json.data?.discountNodes?.edges ?? []
    const activeDiscounts: ActiveDiscount[] = edges
      .filter((edge: { node: { discount: { status?: string } } }) => edge.node?.discount?.status === "ACTIVE")
      .map((edge: {
        node: {
          id: string
          discount: {
            title?: string
            status?: string
            customerGets?: {
              value?: { percentage?: number }
              items?: {
                collections?: { edges: Array<{ node: { id: string } }> }
                products?: { edges: Array<{ node: { id: string } }> }
              }
            }
          }
        }
      }) => {
        const d = edge.node.discount
        const customerGets = d.customerGets
        const percentage = customerGets?.value && "percentage" in customerGets.value ? customerGets.value.percentage : 0
        const collectionEdges = customerGets?.items && "collections" in customerGets.items
          ? (customerGets.items.collections?.edges ?? [])
          : []
        const collectionIds = collectionEdges.map((col: { node: { id: string } }) => col.node.id)
        return {
          id: edge.node.id,
          title: d.title ?? "",
          status: d.status ?? "",
          percentage: typeof percentage === "number" ? percentage : 0,
          collectionIds,
        }
      })

    const body: ActiveDiscountsResponse = {
      active: activeDiscounts.length > 0,
      discounts: activeDiscounts,
    }
    return NextResponse.json(body)
  } catch (error) {
    console.error("[active-discounts]", error)
    return NextResponse.json({ active: false, discounts: [] }, { status: 200 })
  }
}
