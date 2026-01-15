"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Cart, CartLine, Product, ProductVariant } from "@/lib/shopify-types"

interface CartContextType {
  cart: Cart
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void
  removeFromCart: (lineId: string) => void
  updateQuantity: (lineId: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const initialCart: Cart = {
  id: "cart_1",
  lines: [],
  totalQuantity: 0,
  subtotal: "0.00",
  checkoutUrl: "/checkout",
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(initialCart)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const calculateSubtotal = (lines: CartLine[]): string => {
    const total = lines.reduce((sum, line) => {
      return sum + Number.parseFloat(line.variant.price) * line.quantity
    }, 0)
    return total.toFixed(2)
  }

  const addToCart = useCallback((product: Product, variant: ProductVariant, quantity = 1) => {
    setCart((prev) => {
      const existingLineIndex = prev.lines.findIndex((line) => line.variant.id === variant.id)

      let newLines: CartLine[]
      if (existingLineIndex >= 0) {
        newLines = prev.lines.map((line, index) =>
          index === existingLineIndex ? { ...line, quantity: line.quantity + quantity } : line,
        )
      } else {
        const newLine: CartLine = {
          id: `line_${Date.now()}`,
          quantity,
          product,
          variant,
        }
        newLines = [...prev.lines, newLine]
      }

      return {
        ...prev,
        lines: newLines,
        totalQuantity: newLines.reduce((sum, line) => sum + line.quantity, 0),
        subtotal: calculateSubtotal(newLines),
      }
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((lineId: string) => {
    setCart((prev) => {
      const newLines = prev.lines.filter((line) => line.id !== lineId)
      return {
        ...prev,
        lines: newLines,
        totalQuantity: newLines.reduce((sum, line) => sum + line.quantity, 0),
        subtotal: calculateSubtotal(newLines),
      }
    })
  }, [])

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(lineId)
        return
      }

      setCart((prev) => {
        const newLines = prev.lines.map((line) => (line.id === lineId ? { ...line, quantity } : line))
        return {
          ...prev,
          lines: newLines,
          totalQuantity: newLines.reduce((sum, line) => sum + line.quantity, 0),
          subtotal: calculateSubtotal(newLines),
        }
      })
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setCart(initialCart)
  }, [])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
