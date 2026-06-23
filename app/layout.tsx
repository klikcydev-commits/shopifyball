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
import { MetaPixelTracker } from "@/components/analytics/meta-pixel-tracker"
import { FB_PIXEL_ID } from "@/lib/fpixel"

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
        {FB_PIXEL_ID ? (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
            <MetaPixelTracker />
          </>
        ) : null}
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