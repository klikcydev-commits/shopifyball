"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { products } from "@/lib/mock-data"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")

  const filteredProducts =
    query.length > 0
      ? products.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
        )
      : []

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

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />

      {/* Dialog */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="bg-background rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <button onClick={() => onOpenChange(false)} className="p-1.5 hover:bg-secondary rounded transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Results */}
          {query.length > 0 && (
            <div className="max-h-96 overflow-y-auto p-4">
              {filteredProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No products found</p>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/#${product.handle}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <div className="relative w-12 h-12 bg-muted rounded overflow-hidden">
                        <Image
                          src={product.images[0]?.url || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.title}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(product.price, product.currencyCode || "EUR")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer hint */}
          <div className="p-3 border-t border-border bg-secondary/50">
            <p className="text-xs text-muted-foreground text-center">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">ESC</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
