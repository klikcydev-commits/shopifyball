import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getProduct } from '@/lib/shopify'
import { ProductDetails } from '@/components/product/product-details'
import type { Metadata } from 'next'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  try {
    const { handle } = await params
    const product = await getProduct(handle)

    if (!product) {
      return {
        title: 'Product Not Found | Lemah',
      }
    }

    const desc =
      (product.description?.replace(/<[^>]*>/g, '').slice(0, 120).trim() || product.title) +
      ' — Dubai & UAE delivery.'
    return {
      title: `${product.title} | Football Gifts Dubai | Lemah`,
      description: desc,
      openGraph: {
        title: `${product.title} | Football Gifts Dubai | Lemah`,
        description: desc,
        images: product.images.edges[0]?.node.url
          ? [
              {
                url: product.images.edges[0].node.url,
                alt: product.images.edges[0].node.altText || product.title,
              },
            ]
          : [],
      },
    }
  } catch (error) {
    return {
      title: 'Product | Lemah',
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  let product
  
  try {
    product = await getProduct(handle)
  } catch (error) {
    console.error('Error fetching product:', error)
    // Re-throw to trigger error boundary
    throw error
  }

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="pt-32">
        <ProductDetails product={product} />
      </main>
      <Footer />
    </>
  )
}


