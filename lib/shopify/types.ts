export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        id: string
        url: string
        altText: string | null
        width: number
        height: number
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        price: {
          amount: string
          currencyCode: string
        }
        availableForSale: boolean
        selectedOptions: Array<{
          name: string
          value: string
        }>
        image?: {
          url: string
          altText: string | null
        }
      }
    }>
  }
  options: Array<{
    id: string
    name: string
    values: string[]
  }>
  collections: {
    edges: Array<{
      node: {
        id: string
        title: string
        handle: string
      }
    }>
  }
}

export interface ShopifyCollection {
  id: string
  title: string
  handle: string
  description: string
  image?: {
    url: string
    altText: string | null
  }
  products: {
    edges: Array<{
      node: ShopifyProduct
    }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}

export interface ShopifyMenu {
  id: string
  title: string
  items: Array<{
    id: string
    title: string
    url: string
    items?: Array<{
      id: string
      title: string
      url: string
    }>
  }>
}

export interface ShopifyPage {
  id: string
  title: string
  handle: string
  body: string
  bodySummary: string
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalTaxAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    edges: Array<{
      node: {
        id: string
        quantity: number
        cost: {
          totalAmount: {
            amount: string
            currencyCode: string
          }
        }
        merchandise: {
          id: string
          title: string
          selectedOptions: Array<{
            name: string
            value: string
          }>
          product: {
            id: string
            title: string
            handle: string
            images: {
              edges: Array<{
                node: {
                  url: string
                  altText: string | null
                }
              }>
            }
          }
          price: {
            amount: string
            currencyCode: string
          }
        }
      }
    }>
  }
}



