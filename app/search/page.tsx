import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/ui/page-hero'
import { SearchClient } from './search-client'
import { getCollections } from '@/lib/shopify'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Search Products | LeMah',
  description: 'Browse our collection of premium football gear',
}

export default async function SearchPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await searchParamsPromise
  const collectionHandle = typeof searchParams.collection === 'string' ? searchParams.collection : undefined
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined

  let collections: Awaited<ReturnType<typeof getCollections>> = []
  
  try {
    collections = await getCollections(20)
  } catch (error) {
    console.error('Error fetching collections:', error)
    // Continue with empty collections array
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <PageHero 
          title="Shop Our Collection"
          subtitle="Discover premium football gear designed for champions at every level."
          badge="Browse Products"
        />
        
        <Suspense fallback={<div className="section-padding bg-cream" />}>
          <SearchClient
            collectionHandle={collectionHandle}
            query={query}
            collections={collections}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
