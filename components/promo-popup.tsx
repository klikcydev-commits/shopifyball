"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Tag, Truck, X } from "lucide-react"

const DISMISS_KEY = "promoPopupDismissedAt"
const DISMISS_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

export function PromoPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) || "0")
      const isWithinDismissWindow = Date.now() - dismissedAt < DISMISS_TTL_MS
      if (isWithinDismissWindow) return
    } catch {
      // ignore storage read errors
    }

    const showTimer = window.setTimeout(() => setVisible(true), 1200)
    const hideTimer = window.setTimeout(() => setVisible(false), 9000)
    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      // ignore storage write errors
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/60 bg-background/95 p-3.5 shadow-2xl backdrop-blur-md sm:p-4"
          role="status"
          aria-live="polite"
          aria-label="Promotional offer"
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close promotion popup"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Special Offers</p>
            <div className="mt-2.5 space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300 sm:text-sm">
                <Tag className="h-4 w-4" aria-hidden />
                Sale is live now
              </p>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 sm:text-sm">
                <Truck className="h-4 w-4" aria-hidden />
                Free Delivery available
              </p>
            </div>
            <Link
              href="/shop"
              onClick={dismiss}
              className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90 sm:text-sm"
            >
              Shop now
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
