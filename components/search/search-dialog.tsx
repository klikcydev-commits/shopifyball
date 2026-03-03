"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { searchProductsAction } from "@/app/actions/product-actions"
import type { ShopifyProduct } from "@/lib/shopify/types"
import { adaptShopifyProduct } from "@/lib/shopify/adapter"
import { ProductPrice } from "@/components/products/product-price"
interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEBOUNCE_MS = 300

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) {
      setProducts([])
      setError(null)
      return
    }
    setIsSearching(true)
    setError(null)
    try {
      const result = await searchProductsAction(trimmed)
      setProducts(result.products ?? [])
      if (result.error) setError(result.error)
    } catch {
      setProducts([])
      setError("Search failed")
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      runSearch(query)
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query, open, runSearch])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setProducts([])
      setError(null)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onOpenChange])

  if (!open) return null

  const trimmed = query.trim()
  const showResults = trimmed.length > 0
  const showEmpty = showResults && !isSearching && products.length === 0 && !error

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />

      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="bg-background rounded-lg shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
              autoFocus
              aria-label="Search products"
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-1.5 hover:bg-secondary rounded transition-colors"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {showResults && (
            <div className="max-h-96 overflow-y-auto p-4">
              {error && (
                <p className="text-center text-destructive text-sm py-4">{error}</p>
              )}
              {isSearching && (
                <p className="text-center text-muted-foreground py-8">Searching...</p>
              )}
              {showEmpty && (
                <p className="text-center text-muted-foreground py-8">No products found</p>
              )}
              {!error && !isSearching && products.length > 0 && (
                <div className="space-y-2">
                  {products.map((shopifyProduct) => {
                    const product = adaptShopifyProduct(shopifyProduct)
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="relative w-12 h-12 bg-muted rounded overflow-hidden shrink-0">
                          <Image
                            src={product.images?.[0]?.url ?? "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.title}</p>
                          <div className="text-xs mt-0.5">
                            <ProductPrice
                              price={product.price}
                              compareAtPrice={product.compareAtPrice ?? undefined}
                              currencyCode={product.currencyCode ?? "AED"}
                              showWasNow
                              showPercentOff={false}
                              showSavings
                              size="sm"
                            />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div className="p-3 border-t border-border bg-secondary/50">
            <p className="text-xs text-muted-foreground text-center">
              Results from your Shopify store. Press{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">ESC</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
