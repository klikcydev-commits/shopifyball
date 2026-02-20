import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Oswald } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/components/cart/cart-context"
import { PromotionsProvider } from "@/components/cart/promotions-context"
import { PromoBanner } from "@/components/PromoBanner"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
})

export const metadata: Metadata = {
  title: {
    default: "Football Gifts Dubai & UAE | Lemah",
    template: "%s | Lemah",
  },
  description:
    "Shop premium football gifts, wall art, and collectible frames in Dubai & UAE. Perfect for teens and football fans. Fast UAE delivery.",
  keywords: [
    "football gifts dubai",
    "football gifts uae",
    "football accessories dubai",
    "gifts for football fans dubai",
    "ronaldo gift dubai",
    "real madrid gifts uae",
  ],
  authors: [{ name: "Lemah" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Football Gifts Dubai & UAE | Lemah",
    description: "Premium football gifts, wall art & collectibles in Dubai & UAE. Perfect for teens and football lovers.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1f3a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-sans antialiased">
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X86XPFY2SH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X86XPFY2SH');
          `}
        </Script>
        <PromotionsProvider>
          <PromoBanner />
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </PromotionsProvider>
        <Analytics />
      </body>
    </html>
  )
}