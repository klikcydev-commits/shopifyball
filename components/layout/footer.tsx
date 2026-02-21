"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter } from "lucide-react"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "11Kit", href: "/11kit" },
    { name: "Collections", href: "/#collections" },
    { name: "New Arrivals", href: "/#new" },
  ],
  dubaiUae: [
    { name: "Football Gifts Dubai", href: "/football-gifts-dubai" },
    { name: "Football Gifts UAE", href: "/football-gifts-uae" },
    { name: "Ronaldo Gifts Dubai", href: "/ronaldo-gifts-dubai" },
    { name: "Messi Gifts Dubai", href: "/messi-gifts-dubai" },
    { name: "Gifts for Teens Dubai", href: "/football-gifts-for-teens-dubai" },
  ],
  support: [
    { name: "Contact", href: "/contact" },
    { name: "Shipping & Returns", href: "/contact#faq" },
    { name: "FAQs", href: "/contact#faq" },
    { name: "Size Guide", href: "/contact" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Our Story", href: "/about" },
    { name: "Sustainability", href: "/about#sustainability" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-[15px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          <div className="col-span-2">
            <Link
              href="/"
              className="inline-block mb-4 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="LeMah"
                width={140}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 max-w-xs leading-relaxed">
              Built around the ritual â€” the walk to the pitch, the light, the silence before noise.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Dubai & UAE</h4>
            <ul className="space-y-3">
              {footerLinks.dubaiUae.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <a href="#" className="text-white/60 hover:text-gold transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-gold transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <span suppressHydrationWarning>© {new Date().getFullYear()} LEMAH</span>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
