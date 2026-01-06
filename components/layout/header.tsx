'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingBag, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/cart/cart-provider'
import { CartModal } from '@/components/cart/cart-modal'
import { fetchMenu } from '@/app/actions/menu-actions'

interface MenuItem {
  id: string
  title: string
  url: string
  items?: MenuItem[]
}

const defaultNavLinks: MenuItem[] = [
  { id: 'home', title: 'Home', url: '/' },
  { id: 'shop', title: 'Shop', url: '/search' },
  { id: 'about', title: 'About', url: '/about' },
  { id: 'contact', title: 'Contact', url: '/contact' },
]

// Convert Shopify URLs to local paths
function normalizeUrl(url: string): string {
  if (!url) return '/'
  try {
    const u = new URL(url)
    // Convert Shopify collection URLs to search page
    if (u.pathname.startsWith('/collections/')) {
      const handle = u.pathname.replace('/collections/', '')
      return `/search?collection=${handle}`
    }
    return u.pathname + u.search + u.hash
  } catch {
    // If it's already a relative URL
    if (url.startsWith('/collections/')) {
      const handle = url.replace('/collections/', '')
      return `/search?collection=${handle}`
    }
    return url
  }
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [navLinks, setNavLinks] = useState<MenuItem[]>(defaultNavLinks)
  const pathname = usePathname()
  const { cart } = useCart()

  const cartItemCount = cart?.lines?.edges?.reduce((total, edge) => total + (edge?.node?.quantity ?? 0), 0) ?? 0

  // Fetch menu from Shopify
  useEffect(() => {
    async function loadMenu() {
      try {
        const menu = await fetchMenu('main-menu')
        if (menu && menu.items && menu.items.length > 0) {
          const items = menu.items.map((item) => ({
            id: item.id,
            title: item.title,
            url: normalizeUrl(item.url),
            items: item.items?.map((subItem) => ({
              id: subItem.id,
              title: subItem.title,
              url: normalizeUrl(subItem.url),
            })),
          }))
          setNavLinks(items)
        }
      } catch (error) {
        console.error('Error loading menu:', error)
        // Keep default nav links on error
      }
    }
    loadMenu()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-navy/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="font-heading font-bold text-navy text-xl">L</span>
              </div>
              <span className="font-heading text-2xl text-primary-foreground tracking-wide">
                <span className="text-gold">LeMah</span>
              </span>
            </Link>

            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.id} className="relative group">
                  <Link
                    href={link.url}
                    className={`font-medium text-sm uppercase tracking-wider transition-colors duration-300 relative py-2 ${
                      pathname === link.url
                        ? 'text-gold'
                        : 'text-primary-foreground hover:text-gold'
                    }`}
                  >
                    {link.title}
                    {pathname === link.url && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                  {link.items && link.items.length > 0 && (
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-navy border border-navy-light rounded-lg shadow-lg py-2 min-w-[200px]">
                        {link.items.map((subLink) => (
                          <Link
                            key={subLink.id}
                            href={subLink.url}
                            className="block px-4 py-2 text-sm text-primary-foreground hover:text-gold hover:bg-navy-light transition-colors"
                          >
                            {subLink.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <Link href="/search" className="text-primary-foreground hover:text-gold transition-colors hidden sm:block">
                <Search className="w-5 h-5" />
              </Link>
              <button className="text-primary-foreground hover:text-gold transition-colors hidden sm:block">
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-primary-foreground hover:text-gold transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-navy text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                className="lg:hidden text-primary-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-navy border-t border-navy-light"
            >
              <div className="container-custom py-6">
                <ul className="flex flex-col gap-4">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.url}
                        className={`block py-2 font-heading text-lg uppercase tracking-wider ${
                          pathname === link.url
                            ? 'text-gold'
                            : 'text-primary-foreground hover:text-gold'
                        }`}
                      >
                        {link.title}
                      </Link>
                      {link.items && link.items.length > 0 && (
                        <div className="pl-4 mt-2 space-y-2">
                          {link.items.map((subLink) => (
                            <Link
                              key={subLink.id}
                              href={subLink.url}
                              className="block py-1 text-primary-foreground/70 hover:text-gold transition-colors"
                            >
                              {subLink.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
                <Button variant="hero" size="lg" className="w-full mt-6" asChild>
                  <Link href="/search">Shop Now</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
