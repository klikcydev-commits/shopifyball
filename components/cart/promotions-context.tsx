"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export interface PromoItem {
  kind: "deal" | "free_shipping" | "bxgy" | "other"
  title: string
  summary: string
  startsAt: string | null
  endsAt: string | null
}

interface PromotionsState {
  hasActivePromos: boolean
  hasFreeShipping: boolean
  promos: PromoItem[]
  isLoading: boolean
  /** Refetch active offers from Shopify (e.g. free shipping, deals). Call when cart opens or after discount changes. */
  refetch: () => Promise<void>
}

const defaultState: PromotionsState = {
  hasActivePromos: false,
  hasFreeShipping: false,
  promos: [],
  isLoading: true,
  refetch: async () => {},
}

const PromotionsContext = createContext<PromotionsState>(defaultState)

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<PromotionsState, "refetch">>({
    hasActivePromos: false,
    hasFreeShipping: false,
    promos: [],
    isLoading: true,
  })

  const fetchPromos = useCallback(async () => {
    try {
      setState((s) => ({ ...s, isLoading: true }))
      const res = await fetch("/api/promotions")
      const data = await res.json()
      const promos = data.promos ?? []
      const hasFreeShipping = promos.some((p: PromoItem) => p.kind === "free_shipping")
      setState({
        hasActivePromos: data.hasActivePromos === true && promos.length > 0,
        hasFreeShipping,
        promos,
        isLoading: false,
      })
    } catch {
      setState((s) => ({ ...s, isLoading: false }))
    }
  }, [])

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- fetch promotions on mount */
    fetchPromos()
  }, [fetchPromos])

  return (
    <PromotionsContext.Provider value={{ ...state, refetch: fetchPromos }}>
      {children}
    </PromotionsContext.Provider>
  )
}

export function usePromotions(): PromotionsState {
  return useContext(PromotionsContext)
}
