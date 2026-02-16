"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { Cart, CartLine, Product, ProductVariant } from "@/lib/shopify-types"
import { shopifyCartToCart } from "@/lib/shopify/cart-adapter"
import {
  getCartAction,
  addToCartAction,
  updateCartAction,
  removeFromCartAction,
} from "@/app/actions/cart-actions"

const CART_ID_KEY = "lemah_cart_id"

interface CartContextType {
  cart: Cart
  cartId: string | null
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isLoading: boolean
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => Promise<void>
  removeFromCart: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const emptyCart: Cart = {
  id: "",
  lines: [],
  totalQuantity: 0,
  subtotal: "0.00",
  checkoutUrl: "",
}

function loadCartId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CART_ID_KEY)
}

function saveCartId(id: string | null) {
  if (typeof window === "undefined") return
  if (id) localStorage.setItem(CART_ID_KEY, id)
  else localStorage.removeItem(CART_ID_KEY)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart)
  const [cartId, setCartIdState] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    const id = loadCartId()
    if (!id) return
    setCartIdState(id)
    getCartAction(id)
      .then((shopifyCart) => {
        if (shopifyCart) setCartFromShopify(shopifyCart)
        else saveCartId(null)
      })
      .catch(() => saveCartId(null))
  }, [setCartFromShopify])

  const addToCart = useCallback(
    async (product: Product, variant: ProductVariant, quantity = 1) => {
      setIsLoading(true)
      try {
        const shopifyCart = await addToCartAction(cartId, variant.id, quantity)
        if (shopifyCart) setCartFromShopify(shopifyCart)
        setIsCartOpen(true)
      } catch (err) {
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
      setIsLoading(true)
      try {
        const shopifyCart = await removeFromCartAction(cartId, lineId)
        if (shopifyCart) setCartFromShopify(shopifyCart)
      } catch (err) {
        console.error("Remove from cart failed:", err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [cartId, setCartFromShopify]
  )

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId) return
      if (quantity < 1) {
        await removeFromCart(lineId)
        return
      }
      setIsLoading(true)
      try {
        const shopifyCart = await updateCartAction(cartId, lineId, quantity)
        if (shopifyCart) setCartFromShopify(shopifyCart)
      } catch (err) {
        console.error("Update quantity failed:", err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [cartId, removeFromCart, setCartFromShopify]
  )

  const clearCart = useCallback(() => {
    setCart(emptyCart)
    setCartIdState(null)
    saveCartId(null)
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        isCartOpen,
        setIsCartOpen,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
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
