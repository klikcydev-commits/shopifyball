'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Heart, Share2, Check, Star, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KitProduct {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  images: string[]
  features: string[]
  sizes?: string[]
  inStock: boolean
}

interface KitDisplayProps {
  products: KitProduct[]
}

export function KitDisplay({ products }: KitDisplayProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // If no products, show placeholder
  if (products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-navy mb-4">
            The 11 Kit Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium Real Madrid kits coming soon. Check back for our exclusive collection.
          </p>
        </motion.div>

        {/* Placeholder Card - Beautiful Design */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="overflow-hidden border-2 border-navy/20 shadow-2xl bg-gradient-to-br from-background to-cream">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative aspect-square bg-gradient-to-br from-navy/10 to-navy/5 p-8 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Award className="w-24 h-24 text-gold/30 mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg font-medium">
                        Product Image Coming Soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <div className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-bold uppercase tracking-wider mb-4">
                    Coming Soon
                  </div>
                  <h3 className="font-heading text-4xl md:text-5xl text-navy mb-4">
                    The 11 Kit
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm">(Coming Soon)</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    The ultimate Real Madrid kit collection. Premium quality, authentic design, 
                    and everything you need to show your support for Los Blancos.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-navy">
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-gold" />
                      </div>
                      <span className="font-medium">Official Real Madrid Licensed</span>
                    </div>
                    <div className="flex items-center gap-3 text-navy">
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-gold" />
                      </div>
                      <span className="font-medium">Premium Quality Materials</span>
                    </div>
                    <div className="flex items-center gap-3 text-navy">
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-gold" />
                      </div>
                      <span className="font-medium">Complete Kit Set</span>
                    </div>
                    <div className="flex items-center gap-3 text-navy">
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-gold" />
                      </div>
                      <span className="font-medium">Multiple Size Options</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-navy/10">
                  <p className="text-2xl md:text-3xl font-bold text-navy mb-2">
                    Coming Soon
                  </p>
                  <p className="text-muted-foreground mb-6">
                    We're preparing something special for you
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="flex-1 group"
                      disabled
                    >
                      <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Notify Me When Available
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="px-6"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={cn(
                        "w-5 h-5",
                        isFavorite && "fill-red-500 text-red-500"
                      )} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="px-6"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // When products are added, display them beautifully
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-navy mb-4">
          The 11 Kit Collection
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Premium Real Madrid kits for true Madridistas
        </p>
      </motion.div>

      <div className="grid gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-2 border-navy/20 shadow-2xl bg-gradient-to-br from-background to-cream">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Gallery */}
                <div className="relative aspect-square bg-gradient-to-br from-navy/10 to-navy/5">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <div className="relative w-full h-full">
                        <Image
                          src={product.images[selectedImageIndex]}
                          alt={product.name}
                          fill
                          className="object-contain p-8"
                          priority
                        />
                      </div>
                      {product.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {product.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedImageIndex(idx)}
                              className={cn(
                                "w-3 h-3 rounded-full transition-all",
                                idx === selectedImageIndex 
                                  ? "bg-gold w-8" 
                                  : "bg-white/50 hover:bg-white/80"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="w-24 h-24 text-gold/30" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="font-heading text-4xl md:text-5xl text-navy mb-4">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      {product.description}
                    </p>
                    
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-3 mb-6">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-navy">
                            <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-gold" />
                            </div>
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
                          Select Size
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={cn(
                                "px-6 py-3 border-2 rounded-lg font-semibold transition-all",
                                selectedSize === size
                                  ? "border-gold bg-gold/20 text-gold"
                                  : "border-navy/20 hover:border-gold/50 text-navy"
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-navy/10">
                    <div className="flex items-baseline gap-4 mb-6">
                      <p className="text-3xl md:text-4xl font-bold text-navy">
                        {product.price}
                      </p>
                      {product.originalPrice && (
                        <p className="text-xl text-muted-foreground line-through">
                          {product.originalPrice}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        variant="hero" 
                        size="lg" 
                        className="flex-1 group"
                        disabled={!product.inStock || !selectedSize}
                      >
                        <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="px-6"
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        <Heart className={cn(
                          "w-5 h-5",
                          isFavorite && "fill-red-500 text-red-500"
                        )} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="px-6"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
