import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getProduct } from '@/lib/shopify'
import { ProductDetails } from '@/components/product/product-details'
import { getBaseUrl, getProductDescriptionSuffix, getProductTitleTemplate } from '@/lib/seo/build-metadata'
import type { Metadata } from 'next'

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
      return { title: 'Product Not Found | Lemah' }
    }

    const baseUrl = getBaseUrl()
    const suffix = getProductDescriptionSuffix()
    const titleTemplate = getProductTitleTemplate()
    const title = titleTemplate.replace('{productTitle}', product.title)
    const desc =
      (product.description?.replace(/<[^>]*>/g, '').slice(0, 120).trim() || product.title) + ` — ${suffix}`
    const canonical = `${baseUrl}/products/${handle}`
    const ogImage = product.images.edges[0]?.node
    const imageUrl = ogImage?.url
    const imageAlt = ogImage?.altText || product.title

    return {
      title,
      description: desc,
      alternates: { canonical },
      openGraph: {
        title,
        description: desc,
        url: canonical,
        type: 'website',
        images: imageUrl ? [{ url: imageUrl, alt: imageAlt }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: desc,
        images: imageUrl ? [imageUrl] : undefined,
      },
    }
  } catch {
    return { title: 'Product | Lemah' }
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


