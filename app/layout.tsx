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
import { getPageMetadata } from "@/lib/seo/build-metadata"

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
      <head>
        {/* Google Tag Manager - as high in head as possible */}
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PCV4CGG5');`}
        </Script>
      </head>
      <body className="font-sans antialiased">
        {/* Google Tag Manager (noscript) - immediately after opening body */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PCV4CGG5"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
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