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
  params: { handle: string }
}): Promise<Metadata> {
  try {
    const product = await getProduct(params.handle)

    if (!product) {
      return {
        title: 'Product Not Found | LeMah',
      }
    }

    return {
      title: `${product.title} | LeMah`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
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
      title: 'Product | LeMah',
    }
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle)

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


