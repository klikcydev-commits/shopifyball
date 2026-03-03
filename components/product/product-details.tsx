'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ShopifyProduct } from '@/lib/shopify/types'
import { Button } from '@/components/ui/button'
import { ClientOnly } from '@/components/ui/client-only'
import { useCart } from '@/components/cart/cart-context'
import { adaptShopifyProduct } from '@/lib/shopify/adapter'
import type { ProductVariant } from '@/lib/shopify-types'
import { ShoppingBag, Check, ExternalLink, Heart, Ruler, Truck, CreditCard, RotateCcw, Banknote, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { buildProductUrl } from '@/lib/shopify/checkout'
import { getSaleState } from '@/lib/sale-helpers'
import { ProductSeoBlock } from '@/components/product/product-seo-block'
import { ProductFaq } from '@/components/product/product-faq'
import { UaeDeliveryAreas } from '@/components/seo/UaeDeliveryAreas'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface ProductDetailsProps {
  product: ShopifyProduct
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.edges[0]?.node || null
  )
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const opts: Record<string, string> = {}
    for (const opt of product.options) {
      if (opt.values.length > 0) opts[opt.name] = opt.values[0]
    }
    return opts
  })
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const images = product.images.edges
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value }
    setSelectedOptions(newOptions)

    // Find matching variant
    const matchingVariant = product.variants.edges.find(({ node: variant }) => {
      return variant.selectedOptions.every(
        (option) => newOptions[option.name] === option.value
      )
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    if (!selectedVariant.availableForSale) {
      toast.error('This variant is not available')
      return
    }

    setIsAdding(true)
    try {
      const adaptedProduct = adaptShopifyProduct(product)
      const matchingVariant = adaptedProduct.variants.find((v: ProductVariant) => v.id === selectedVariant.id)
      if (!matchingVariant) {
        toast.error('Variant not found')
        return
      }
      await addToCart(adaptedProduct, matchingVariant, quantity)
    } catch (error) {
      toast.error('Failed to add to cart')
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  // FINAL DISPLAY PRICE = variant.price only. No extra discount (Shopify price is already the selling price).
  const variantForSale = selectedVariant
    ? {
        price: selectedVariant.price,
        compareAtPrice: selectedVariant.compareAtPrice ?? undefined,
        currencyCode: selectedVariant.price?.currencyCode,
      }
    : null
  const saleState = getSaleState(variantForSale)

  return (
    <div className="py-20 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images - slightly smaller on large screens */}
          <div className="max-w-lg mx-auto lg:mx-0 w-full lg:sticky lg:top-24 self-start">
            <div className="relative w-full max-w-[420px] lg:max-w-[480px] aspect-[1/1] mx-auto rounded-lg overflow-hidden bg-muted mb-4">
              {saleState.onSale && (
                <span className="absolute top-4 left-4 z-10 rounded-md bg-[#0A1931] text-white text-sm font-bold uppercase tracking-wider px-3 py-1.5 shadow-[0_0_14px_rgba(74,127,167,0.6),0_0_28px_rgba(10,25,49,0.5)] animate-pulse">
                  Sale
                </span>
              )}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => setSelectedImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => setSelectedImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" aria-hidden />
                  </button>
                </>
              )}
              {images[selectedImageIndex] && (
                <Image
                  src={images[selectedImageIndex].node.url}
                  alt={images[selectedImageIndex].node.altText || product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              )}
            </div>
            {images.length > 1 && (
              <ClientOnly
                fallback={
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square rounded-lg bg-muted/50 animate-pulse" />
                    ))}
                  </div>
                }
              >
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={image.node.id}
                      type="button"
                      aria-label={`View image ${index + 1}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-gold'
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <Image
                        src={image.node.url}
                        alt={image.node.altText || product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12.5vw"
                      />
                    </button>
                  ))}
                </div>
              </ClientOnly>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-navy mb-4">{product.title}</h1>
            <div className="mb-6">
              {saleState.onSale ? (
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg text-zinc-500 dark:text-zinc-400 line-through">
                    <del>{saleState.compareAtText}</del>
                  </span>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {saleState.priceText}
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Save {saleState.saveAmountText} ({saleState.savePercentText})
                  </span>
                  {saleState.percentOff > 0 && (
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {saleState.percentOff}% OFF
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {saleState.priceText}
                </span>
              )}
            </div>

            <ClientOnly
              fallback={
                <div className="mb-8 space-y-6" style={{ minHeight: 280 }}>
                  <div className="h-16 bg-muted/30 rounded animate-pulse" />
                  <div className="h-14 bg-muted/30 rounded animate-pulse" />
                  <div className="h-12 bg-muted/30 rounded animate-pulse" />
                  <div className="h-12 bg-muted/30 rounded animate-pulse" />
                </div>
              }
            >
              {/* Options – hide "Title" (e.g. Default Title) when it's the only meaningless option */}
              {product.options
                .filter((option) => option.name.toLowerCase() !== 'title')
                .map((option) => (
                <div key={option.id} className="mb-6">
                  <label className="block text-sm font-medium mb-2">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`px-4 py-2 rounded-md border-2 transition-all ${
                            isSelected
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-border hover:border-gold/50'
                          }`}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-xs font-medium mb-1.5">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-muted"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-sm border border-border rounded-lg hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                variant="default"
                size="lg"
                className="w-full mb-4"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale || isAdding}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {isAdding
                  ? 'Adding...'
                  : selectedVariant?.availableForSale
                    ? 'Add to Cart'
                    : 'Sold Out'}
              </Button>

              {/* Buy Now - Direct to shop.lemah.store */}
              {selectedVariant?.availableForSale && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full mb-3"
                    onClick={() => {
                      window.location.href = buildProductUrl(product.handle)
                    }}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Buy Now on Shop
                  </Button>
                  <div className="flex flex-col gap-2 mb-4 text-sm font-semibold text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 shrink-0 text-accent" aria-hidden />
                      15 Days Free Return
                    </p>
                    <p className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 shrink-0 text-accent" aria-hidden />
                      Cash on Delivery
                    </p>
                    <p className="flex items-center gap-2">
                      <Truck className="w-4 h-4 shrink-0 text-accent" aria-hidden />
                      Free Delivery
                    </p>
                  </div>
                </>
              )}

              {selectedVariant?.availableForSale && (
                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-8">
                  <Check className="w-4 h-4 text-accent" />
                  In stock and ready to ship
                </p>
              )}
            </ClientOnly>

            <div
              className="prose prose-sm max-w-none mb-6 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

            <Accordion type="single" collapsible className="w-full mb-8" defaultValue="why-you-will-love-it">
              <AccordionItem value="why-you-will-love-it" className="border-b border-border">
                <AccordionTrigger className="text-left font-medium py-4">
                  <span className="flex items-center gap-3">
                    <Heart className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
                    Why You Will Love It
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  <ul className="space-y-3 list-disc pl-5">
                    <li>
                      <strong>3D Angular Frame:</strong> See your image from every angle—each facet of the frame displays the design, creating a dynamic 3D effect wherever you look.
                    </li>
                    <li>
                      <strong>Museum-Quality Print:</strong> Vibrant, high resolution colors that won&apos;t fade over time.
                    </li>
                    <li>
                      <strong>Premium Materials:</strong> Thick, durable canvas with a premium quality light-weight black frame and sleek glossy acrylic for protection.
                    </li>
                    <li>
                      <strong>Perfect for Any Space:</strong> Elevate your bedroom, gaming setup, or living room with a stylish, modern touch.
                    </li>
                    <li>
                      <strong>Great Gift Idea:</strong> Our posters are personal, stylish, and reflects passion—whether it&apos;s music, sports, or cars. It&apos;s more than just a decor; it&apos;s a meaningful piece that adds personality and good vibes to the space.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sizes" className="border-b border-border">
                <AccordionTrigger className="text-left font-medium py-4">
                  <span className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
                    Sizes
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  30x40 cm (11.8x15.7″)
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-b border-border">
                <AccordionTrigger className="text-left font-medium py-4">
                  <span className="flex items-center gap-3">
                    <Truck className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
                    Shipping
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  Free and fast shipping across UAE within 1–2 days.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="payment" className="border-b border-border">
                <AccordionTrigger className="text-left font-medium py-4">
                  <span className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
                    Payment
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  Cash on Delivery & Secure Online Payments Available!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns" className="border-b border-border">
                <AccordionTrigger className="text-left font-medium py-4">
                  <span className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
                    Returns
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">
                  Your satisfaction is our top priority. We take pride in delivering premium-quality wall canvas posters, but if you ever receive a defective item or feel the product doesn&apos;t meet your expectations, we offer a totally free return to ensure you shop with confidence.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <ProductSeoBlock title={product.title} handle={product.handle} />
            <ProductFaq />
            <div className="mt-8">
              <UaeDeliveryAreas variant="compact" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



