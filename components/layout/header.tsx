"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingBag, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { SearchDialog } from "@/components/search/search-dialog"
import { getHeaderPromoAction } from "@/app/actions/promo-actions"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Blog", href: "/blog" },
  { name: "11Kit", href: "/11kit" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [promo, setPromo] = useState<{ hasDeals: boolean; saleCount: number } | null>(null)
  const pathname = usePathname()
  const { cart, isCartOpen, setIsCartOpen } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    getHeaderPromoAction()
      .then(setPromo)
      .catch(() => setPromo({ hasDeals: false, saleCount: 0 }))
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent",
        )}
      >
        {/* Promo / Deals banner – from Shopify sale products, else default drop */}
        <div className="bg-primary text-primary-foreground text-xs py-1.5 text-center overflow-hidden">
          <div className="animate-wave-shimmer inline-block">
            {promo?.hasDeals ? (
              <>
                <span className="font-medium tracking-wider">SALE — </span>
                <span className="font-medium tracking-wider">
                  {promo.saleCount} product{promo.saleCount !== 1 ? "s" : ""} with deals —
                </span>
                <Link href="/shop" className="underline underline-offset-2 hover:text-gold transition-colors ml-0.5">
                  SHOP NOW
                </Link>
              </>
            ) : (
              <>
                <span className="font-medium tracking-wider">NEXT DROP: 11KIT — LIMITED — </span>
                <Link href="/11kit" className="underline underline-offset-2 hover:text-gold transition-colors">
                  JOIN LIST
                </Link>
              </>
            )}
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-foreground hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image
                src={isScrolled ? "/logo-sticky.png" : "/logo.png"}
                alt="LeMah"
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto object-contain transition-all duration-300 group-hover:opacity-80"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium tracking-wide uppercase transition-colors relative group",
                    pathname === item.href ? "text-gold" : "text-foreground hover:text-gold",
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300",
                      pathname === item.href ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-foreground hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-foreground hover:text-gold transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cart.totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-xs font-bold flex items-center justify-center text-primary">
                    {cart.totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 bg-background",
            isMobileMenuOpen ? "max-h-64" : "max-h-0",
          )}
        >
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block py-2 text-base font-medium tracking-wide uppercase transition-colors",
                  pathname === item.href ? "text-gold" : "text-foreground hover:text-gold",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
