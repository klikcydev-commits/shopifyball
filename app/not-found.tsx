'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center pt-32 pb-16 bg-cream">
        <div className="container-custom text-center">
          <h1 className="font-heading text-6xl md:text-8xl text-navy mb-4">404</h1>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-6">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button variant="navy" size="lg" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}


