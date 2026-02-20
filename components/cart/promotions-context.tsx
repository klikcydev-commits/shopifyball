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
}

const defaultState: PromotionsState = {
  hasActivePromos: false,
  hasFreeShipping: false,
  promos: [],
  isLoading: true,
}

const PromotionsContext = createContext<PromotionsState>(defaultState)

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PromotionsState>(defaultState)

  const fetchPromos = useCallback(async () => {
    try {
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
    fetchPromos()
  }, [fetchPromos])

  return (
    <PromotionsContext.Provider value={state}>
      {children}
    </PromotionsContext.Provider>
  )
}

export function usePromotions(): PromotionsState {
  return useContext(PromotionsContext)
}
