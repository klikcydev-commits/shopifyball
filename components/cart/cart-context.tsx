"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react"
import type { Cart, Product, ProductVariant } from "@/lib/shopify-types"
import { shopifyCartToCart } from "@/lib/shopify/cart-adapter"
import { loadCartId, saveCartId } from "@/lib/cart-id-storage"
import {
  getCartAction,
  addToCartAction,
  updateCartAction,
  removeFromCartAction,
  applyDiscountCodesAction,
} from "@/app/actions/cart-actions"

interface CartContextType {
  cart: Cart
  cartId: string | null
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isLoading: boolean
  error: string | null
  clearError: () => void
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => void
  applyDiscountCode: (code: string) => Promise<{ success: boolean; error?: string }>
  removeDiscountCode: (code: string) => Promise<void>
  refreshCart: () => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const emptyCart: Cart = {
  id: "",
  lines: [],
  totalQuantity: 0,
  subtotal: "0.00",
  totalAmount: "0.00",
  checkoutUrl: "",
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart)
  const [cartId, setCartIdState] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const updateQtyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setCartFromShopify = useCallback((shopifyCart: { id: string; checkoutUrl: string; cost?: { subtotalAmount?: { amount: string } }; lines?: { edges: unknown[] } } | null) => {
    if (!shopifyCart) {
      setCart(emptyCart)
      setCartIdState(null)
      saveCartId(null)
      return
    }
    setCart(shopifyCartToCart(shopifyCart as Parameters<typeof shopifyCartToCart>[0]))
    setCartIdState(shopifyCart.id)
    saveCartId(shopifyCart.id)
  }, [])

  const refreshCart = useCallback(async () => {
    const id = loadCartId()
    if (!id) return
    try {
      const shopifyCart = await getCartAction(id)
      if (shopifyCart) setCartFromShopify(shopifyCart)
      else {
        saveCartId(null)
        setCartIdState(null)
        setCart(emptyCart)
      }
    } catch {
      saveCartId(null)
      setCartIdState(null)
      setCart(emptyCart)
    }
  }, [setCartFromShopify])

  useEffect(() => {
    const id = loadCartId()
    if (!id) return
    setCartIdState(id)
    getCartAction(id)
      .then((shopifyCart) => {
        if (shopifyCart) setCartFromShopify(shopifyCart)
        else {
          saveCartId(null)
          setCartIdState(null)
        }
      })
      .catch(() => {
        saveCartId(null)
        setCartIdState(null)
      })
  }, [setCartFromShopify])

  const addToCart = useCallback(
    async (product: Product, variant: ProductVariant, quantity = 1) => {
      setError(null)
      setIsLoading(true)
      try {
        const shopifyCart = await addToCartAction(cartId, variant.id, quantity)
        if (shopifyCart) {
          setCartFromShopify(shopifyCart)
          // Refetch cart so UI always shows latest prices/totals from Shopify
          const fresh = await getCartAction(shopifyCart.id)
          if (fresh) setCartFromShopify(fresh)
        }
        setIsCartOpen(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not add to cart"
        setError(message)
        console.error("Add to cart failed:", err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [cartId, setCartFromShopify]
  )

  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!cartId) return
      setError(null)
      setIsLoading(true)
      try {
        const shopifyCart = await removeFromCartAction(cartId, lineId)
        if (shopifyCart) {
          setCartFromShopify(shopifyCart)
          const fresh = await getCartAction(shopifyCart.id)
          if (fresh) setCartFromShopify(fresh)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not remove item"
        setError(message)
        console.error("Remove from cart failed:", err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [cartId, setCartFromShopify]
  )

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      if (!cartId) return
      if (quantity < 1) {
        removeFromCart(lineId)
        return
      }
      setError(null)
      if (updateQtyTimeoutRef.current) clearTimeout(updateQtyTimeoutRef.current)
      updateQtyTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const shopifyCart = await updateCartAction(cartId, lineId, quantity)
          if (shopifyCart) {
            setCartFromShopify(shopifyCart)
            const fresh = await getCartAction(shopifyCart.id)
            if (fresh) setCartFromShopify(fresh)
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Could not update quantity"
          setError(message)
          await refreshCart()
        } finally {
          setIsLoading(false)
          updateQtyTimeoutRef.current = null
        }
      }, 400)
    },
    [cartId, removeFromCart, setCartFromShopify, refreshCart]
  )

  const applyDiscountCode = useCallback(
    async (code: string): Promise<{ success: boolean; error?: string }> => {
      if (!cartId) return { success: false, error: "No cart" }
      const trimmed = code.trim()
      if (!trimmed) return { success: false, error: "Enter a discount code" }
      const currentCodes = (cart.discountCodes ?? []).map((d) => d.code)
      if (currentCodes.map((c) => c.toLowerCase()).includes(trimmed.toLowerCase())) {
        return { success: true }
      }
      setIsLoading(true)
      try {
        const shopifyCart = await applyDiscountCodesAction(cartId, [...currentCodes, trimmed])
        if (shopifyCart) setCartFromShopify(shopifyCart)
        return { success: true }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to apply code"
        return { success: false, error: message }
      } finally {
        setIsLoading(false)
      }
    },
    [cartId, cart.discountCodes, setCartFromShopify]
  )

  const removeDiscountCode = useCallback(
    async (codeToRemove: string) => {
      if (!cartId) return
      const currentCodes = (cart.discountCodes ?? []).map((d) => d.code)
      const nextCodes = currentCodes.filter((c) => c.toLowerCase() !== codeToRemove.toLowerCase())
      if (nextCodes.length === currentCodes.length) return
      setIsLoading(true)
      try {
        const shopifyCart = await applyDiscountCodesAction(cartId, nextCodes)
        if (shopifyCart) setCartFromShopify(shopifyCart)
      } catch (err) {
        console.error("Remove discount code failed:", err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [cartId, cart.discountCodes, setCartFromShopify]
  )

  const clearCart = useCallback(() => {
    setCart(emptyCart)
    setCartIdState(null)
    saveCartId(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        isCartOpen,
        setIsCartOpen,
        isLoading,
        error,
        clearError,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyDiscountCode,
        removeDiscountCode,
        refreshCart,
        clearCart,
      }}
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
