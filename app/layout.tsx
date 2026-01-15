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
  title: 'LeMah - Premium Football Gear',
  description: 'Premium football gear for champions. From the training field to game day, we equip athletes with the best equipment.',
  keywords: ['football', 'sports equipment', 'athletic gear', 'football gear'],
  authors: [{ name: 'LeMah' }],
  openGraph: {
    title: 'LeMah - Premium Football Gear',
    description: 'Premium football gear for champions',
    type: 'website',
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


