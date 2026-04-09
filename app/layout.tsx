import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Oswald } from "next/font/google"
import Script from "next/script"
import { GoogleTagManager } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/components/cart/cart-context"
import { PromotionsProvider } from "@/components/cart/promotions-context"
import { PromoBanner } from "@/components/PromoBanner"
import { MainLoader } from "@/components/MainLoader"
import { Toaster } from "@/components/ui/toaster"
import { getPageMetadata } from "@/lib/seo/build-metadata"
import { WebsiteJsonLd } from "@/components/seo/website-json-ld"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
})

const defaultMeta = getPageMetadata("/")

export const metadata: Metadata = {
  ...defaultMeta,
  title: {
    default: defaultMeta.title as string,
    template: "%s | Lemah",
  },
  authors: [{ name: "Lemah" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
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
      <head />
      <body className="font-sans antialiased">
        <WebsiteJsonLd />
        <GoogleTagManager gtmId="GTM-PCV4CGG5" />
        {/* Google tag (gtag.js) - kept for existing GA */}
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
          <MainLoader />
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