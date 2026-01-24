'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number; code?: string }
  reset: () => void
}) {
  // Check if we're in development mode (client-side check)
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  
  useEffect(() => {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      status: (error as Error & { status?: number }).status,
      code: (error as Error & { code?: string }).code,
    })
  }, [error])

  // Check if it's a Shopify configuration error
  const isShopifyConfigError = error.message.includes('Missing Shopify environment variables') || 
                                error.message.includes('SHOPIFY_STORE_DOMAIN') ||
                                error.message.includes('SHOPIFY_STOREFRONT_ACCESS_TOKEN')

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center pt-32 pb-16 bg-cream">
        <div className="container-custom text-center max-w-2xl">
          <h1 className="font-heading text-4xl md:text-5xl text-navy mb-4">
            Something went wrong!
          </h1>
          
          {isShopifyConfigError ? (
            <div className="mb-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-left">
              <p className="text-destructive font-semibold mb-2">Configuration Error</p>
              <p className="text-sm text-muted-foreground mb-4">
                {error.message}
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file and ensure 
                <code className="bg-muted px-1 py-0.5 rounded mx-1">SHOPIFY_STORE_DOMAIN</code> and 
                <code className="bg-muted px-1 py-0.5 rounded mx-1">SHOPIFY_STOREFRONT_ACCESS_TOKEN</code> are set.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              We're sorry, but something unexpected happened. Please try again.
            </p>
          )}

          {isDevelopment && (
            <div className="mb-8 p-4 bg-muted rounded-lg text-left text-sm">
              <p className="font-semibold mb-2">Error Details (Development Only):</p>
              <p className="text-muted-foreground break-all">{error.message}</p>
              {error.digest && (
                <p className="text-muted-foreground mt-2">
                  <span className="font-semibold">Digest:</span> {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button variant="default" onClick={reset}>
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}



