import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart/cart-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LeMah - Official Real Madrid Accessories',
  description: 'Authentic Real Madrid accessories and merchandise. Official jerseys, scarves, kits, and collectibles for true Madridistas.',
  keywords: ['Real Madrid', 'Real Madrid accessories', 'Real Madrid merchandise', 'Los Blancos', 'Madridista', 'Real Madrid jerseys', 'Real Madrid kit'],
  authors: [{ name: 'LeMah' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'LeMah - Official Real Madrid Accessories',
    description: 'Authentic Real Madrid accessories and merchandise. Official jerseys, scarves, kits, and collectibles for true Madridistas.',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'LeMah - Official Real Madrid Accessories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeMah - Official Real Madrid Accessories',
    description: 'Authentic Real Madrid accessories and merchandise for true Madridistas',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}


