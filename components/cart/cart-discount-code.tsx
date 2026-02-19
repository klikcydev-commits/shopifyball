"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { CartDiscountCode } from "@/lib/shopify-types"
import { useCart } from "./cart-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface CartDiscountCodeProps {
  appliedCodes: CartDiscountCode[]
  onApply: (code: string) => Promise<{ success: boolean; error?: string }>
  onRemove: (code: string) => Promise<void>
  isLoading: boolean
  className?: string
}

/**
 * Apply discount code input + applied code chips with remove.
 * Shows success/error via toast; only displays codes returned by Shopify.
 */
export function CartDiscountCodeInput({
  appliedCodes,
  onApply,
  onRemove,
  isLoading,
  className,
}: CartDiscountCodeProps) {
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const { toast } = useToast()

  const handleApply = async () => {
    const code = input.trim()
    if (!code) return
    setPending(true)
    try {
      const result = await onApply(code)
      if (result.success) {
        setInput("")
        toast({ title: "Discount applied", description: `"${code}" has been applied.` })
      } else {
        toast({
          title: "Discount failed",
          description: result.error ?? "This code isn't valid or doesn't apply to your cart.",
          variant: "destructive",
        })
      }
    } finally {
      setPending(false)
    }
  }

  const loading = isLoading || pending

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Discount code"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          disabled={loading}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          aria-label="Discount code"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !input.trim()}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? "Applying…" : "Apply"}
        </button>
      </div>
      {appliedCodes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {appliedCodes.map((d) => (
            <span
              key={d.code}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                d.applicable
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
              )}
            >
              <span>{d.code}</span>
              <button
                type="button"
                onClick={() => onRemove(d.code)}
                disabled={loading}
                className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50"
                aria-label={`Remove ${d.code}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
