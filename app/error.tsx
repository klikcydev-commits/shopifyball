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
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center pt-32 pb-16 bg-cream">
        <div className="container-custom text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-navy mb-4">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="navy" onClick={reset}>
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



