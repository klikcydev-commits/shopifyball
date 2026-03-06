'use client'

/**
 * Live Viewers - Social proof component for product pages
 * Shows a green status dot and "N person(s) are currently viewing this product."
 *
 * - Each product has unique behavior via seed (product handle/id)
 * - Count stays between 1-9, changes naturally over time
 * - Random interval (4-12s), sometimes up, down, or same
 * - No layout shift, proper singular/plural grammar
 */

import { useState, useEffect } from 'react'

// --- Seeded PRNG: same seed + salt = same "random" value (deterministic per product) ---
function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return h >>> 0
}

function seededRandom(seed: number, salt: number): number {
  const x = Math.sin(seed * 9999 + salt * 12345) * 10000
  return x - Math.floor(x)
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(n)))
}

// --- Component ---
interface LiveViewersProps {
  /** Product handle or ID - used as seed so each product behaves differently */
  productSeed: string
}

export function LiveViewers({ productSeed }: LiveViewersProps) {
  const seed = hashCode(productSeed)

  // Initial value: 1-9, derived from seed (unique per product)
  const [count, setCount] = useState(() =>
    clamp(seededRandom(seed, 0) * 9 + 1, 1, 9)
  )

  useEffect(() => {
    // Interval: 3–8 seconds, randomized per product (from seed)
    const baseMs = 3000 + seededRandom(seed, 100) * 5000

    const timer = setInterval(() => {
      // Use Math.random() for updates so we get real variation (sin-based PRNG was too deterministic)
      const r = Math.random()
      const direction = r < 0.35 ? -1 : r < 0.65 ? 0 : 1 // down, same, up
      const delta = direction === 0 ? 0 : 1 + (Math.random() > 0.5 ? 1 : 0) // 1 or 2

      setCount((prev) => clamp(prev + direction * delta, 1, 9))
    }, baseMs)

    return () => clearInterval(timer)
  }, [seed])

  const text =
    count === 1
      ? '1 person is currently viewing this product.'
      : `${count} people are currently viewing this product.`

  return (
    <div
      className="flex items-center gap-2 text-sm text-muted-foreground mb-6 min-h-[1.5rem]"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Green live dot - 12px, subtle glow, no layout shift */}
      <span
        className="inline-block h-3 w-3 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
        aria-hidden
      />
      <span>{text}</span>
    </div>
  )
}
