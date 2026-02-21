"use client"

import { useEffect, useState } from "react"
import type { ActiveDiscountsResponse } from "@/app/api/active-discounts/route"

export function useActiveDiscounts(): {
  data: ActiveDiscountsResponse | null
  loading: boolean
  error: boolean
} {
  const [data, setData] = useState<ActiveDiscountsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    /* eslint-disable react-hooks/set-state-in-effect -- reset state at start of fetch */
    setLoading(true)
    setError(false)
    /* eslint-enable react-hooks/set-state-in-effect */
    fetch("/api/active-discounts")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        setData({
          active: Boolean(json.active),
          discounts: Array.isArray(json.discounts) ? json.discounts : [],
        })
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
