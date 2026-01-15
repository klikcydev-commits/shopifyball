import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/ui/page-hero'
import type { ShopifyPage } from '@/lib/shopify/types'

interface ShopifyPageProps {
  page: ShopifyPage | null
  fallbackTitle?: string
  fallbackSubtitle?: string
  fallbackBadge?: string
  children?: React.ReactNode
}

export function ShopifyPageComponent({ 
  page, 
  fallbackTitle = 'Page',
  fallbackSubtitle,
  fallbackBadge,
  children 
}: ShopifyPageProps) {
  const title = page?.title || fallbackTitle
  const body = page?.body || ''
  
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <PageHero 
          title={title}
          subtitle={fallbackSubtitle || page?.bodySummary || ''}
          badge={fallbackBadge}
        />
        
        {/* Page Content */}
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              {page && body ? (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground mb-4">
                    Page content not found
                  </p>
                  <p className="text-muted-foreground">
                    This page doesn't exist in your Shopify store yet.
                  </p>
                </div>
              )}
              {children}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
