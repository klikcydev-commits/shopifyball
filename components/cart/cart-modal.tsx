'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from './cart-provider'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, updateItem, removeItem, isLoading } = useCart()

  const cartItems = cart?.lines?.edges || []
  const total = cart?.cost?.totalAmount?.amount || '0'
  const currencyCode = cart?.cost?.totalAmount?.currencyCode || 'USD'

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-end p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="w-full max-w-md bg-background shadow-xl h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Dialog.Title className="text-xl font-heading uppercase tracking-wider">
                  Shopping Cart
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Your cart is empty</p>
                    <p className="text-muted-foreground mb-6">Add items to get started</p>
                    <Button variant="navy" onClick={onClose} asChild>
                      <Link href="/search">Continue Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map(({ node: line }) => {
                      const product = line.merchandise.product
                      const image = product.images?.edges?.[0]?.node
                      const variantTitle = line.merchandise.title

                      return (
                        <div key={line.id} className="flex gap-4 pb-6 border-b border-border last:border-0">
                          {image && (
                            <Link
                              href={`/products/${product.handle}`}
                              onClick={onClose}
                              className="flex-shrink-0"
                            >
                              <Image
                                src={image.url}
                                alt={image.altText || product.title}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                            </Link>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${product.handle}`}
                              onClick={onClose}
                              className="font-medium hover:text-gold transition-colors"
                            >
                              {product.title}
                            </Link>
                            {variantTitle !== 'Default Title' && (
                              <p className="text-sm text-muted-foreground mt-1">{variantTitle}</p>
                            )}
                            <p className="text-gold font-medium mt-2">
                              {line.cost.totalAmount.amount} {line.cost.totalAmount.currencyCode}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => {
                                  if (line.quantity > 1) {
                                    updateItem(line.id, line.quantity - 1)
                                  } else {
                                    removeItem(line.id)
                                  }
                                }}
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-muted transition-colors disabled:opacity-50"
                              >
                                {line.quantity === 1 ? (
                                  <Trash2 className="w-4 h-4" />
                                ) : (
                                  <Minus className="w-4 h-4" />
                                )}
                              </button>
                              <span className="w-8 text-center font-medium">{line.quantity}</span>
                              <button
                                onClick={() => updateItem(line.id, line.quantity + 1)}
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-muted transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span className="text-gold">
                      {total} {currencyCode}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={onClose} asChild>
                      <Link href="/search">Continue Shopping</Link>
                    </Button>
                    <Button
                      variant="navy"
                      className="flex-1"
                      onClick={() => {
                        if (cart?.checkoutUrl) {
                          window.location.href = cart.checkoutUrl
                        }
                      }}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}



