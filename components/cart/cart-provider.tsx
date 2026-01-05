'use client'

import { createContext, useContext, useOptimistic, useTransition, useEffect, useState } from 'react'
import type { ShopifyCart } from '@/lib/shopify/types'
import {
  getCartAction,
  addToCartAction,
  updateCartAction,
  removeFromCartAction,
} from '@/app/actions/cart-actions'

interface CartContextType {
  cart: ShopifyCart | null
  isLoading: boolean
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [optimisticCart, setOptimisticCart] = useOptimistic<ShopifyCart | null>(cart)
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage on mount
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null
    if (cartId) {
      refreshCart(cartId)
    } else {
      setIsLoading(false)
    }
  }, [])

  const refreshCart = async (cartId?: string) => {
    const id = cartId || (typeof window !== 'undefined' ? localStorage.getItem('cartId') : null)
    if (!id) {
      setIsLoading(false)
      return
    }

    try {
      const updatedCart = await getCartAction(id)
      setCart(updatedCart)
      if (updatedCart && typeof window !== 'undefined') {
        localStorage.setItem('cartId', updatedCart.id)
      }
    } catch (error) {
      console.error('Error refreshing cart:', error)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cartId')
      }
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (variantId: string, quantity: number = 1) => {
    startTransition(async () => {
      try {
        const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null
        const updatedCart = await addToCartAction(cartId, variantId, quantity)

        if (updatedCart) {
          setCart(updatedCart)
          if (typeof window !== 'undefined') {
            localStorage.setItem('cartId', updatedCart.id)
          }
        }
      } catch (error) {
        console.error('Error adding item to cart:', error)
        throw error
      }
    })
  }

  const updateItem = async (lineId: string, quantity: number) => {
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null
    if (!cartId) return

    startTransition(async () => {
      try {
        const updatedCart = await updateCartAction(cartId, lineId, quantity)
        if (updatedCart) {
          setCart(updatedCart)
        }
      } catch (error) {
        console.error('Error updating cart item:', error)
        throw error
      }
    })
  }

  const removeItem = async (lineId: string) => {
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null
    if (!cartId) return

    startTransition(async () => {
      try {
        const updatedCart = await removeFromCartAction(cartId, lineId)
        if (updatedCart) {
          setCart(updatedCart)
        } else {
          // Cart is empty, remove from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('cartId')
          }
          setCart(null)
        }
      } catch (error) {
        console.error('Error removing cart item:', error)
        throw error
      }
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        isLoading: isLoading || isPending,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

