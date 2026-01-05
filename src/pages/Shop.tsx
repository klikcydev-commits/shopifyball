import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Eye, Filter, ChevronDown } from "lucide-react";
import { useState } from "react";

const categories = ["All Products", "Footballs", "Helmets", "Gloves", "Cleats", "Apparel"];

const products = [
  {
    id: 1,
    name: "Pro Elite Football",
    category: "Footballs",
    price: 149.99,
    originalPrice: 179.99,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 128,
  },
  {
    id: 2,
    name: "Carbon Flex Helmet",
    category: "Helmets",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80",
    badge: "New",
    rating: 4.8,
    reviews: 64,
  },
  {
    id: 3,
    name: "Grip Master Gloves",
    category: "Gloves",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f76?w=600&q=80",
    badge: "Sale",
    rating: 4.7,
    reviews: 256,
  },
  {
    id: 4,
    name: "Speed Force Cleats",
    category: "Cleats",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80",
    badge: null,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 5,
    name: "Titan Pro Helmet",
    category: "Helmets",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80",
    badge: null,
    rating: 4.6,
    reviews: 42,
  },
  {
    id: 6,
    name: "Elite Receiver Gloves",
    category: "Gloves",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f76?w=600&q=80",
    badge: "New",
    rating: 4.8,
    reviews: 78,
  },
  {
    id: 7,
    name: "Training Football Set",
    category: "Footballs",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80",
    badge: "Sale",
    rating: 4.5,
    reviews: 156,
  },
  {
    id: 8,
    name: "Power Strike Cleats",
    category: "Cleats",
    price: 169.99,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80",
    badge: null,
    rating: 4.7,
    reviews: 95,
  },
];

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All Products");

  const filteredProducts = activeCategory === "All Products"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-navy">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="container-custom relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
                Shop Collection
              </span>
              <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">
                PREMIUM <span className="text-gold">GEAR</span>
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Professional-grade football equipment trusted by champions worldwide.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-cream border-b border-border sticky top-0 z-40">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? "bg-navy text-primary-foreground"
                        : "bg-background text-foreground hover:bg-navy/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {/* Sort & Filter */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-gold transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-gold transition-colors">
                  Sort By
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badge */}
                      {product.badge && (
                        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          product.badge === "Sale" 
                            ? "bg-destructive text-destructive-foreground" 
                            : product.badge === "New"
                            ? "bg-gold text-navy"
                            : "bg-navy text-primary-foreground"
                        }`}>
                          {product.badge}
                        </span>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-md hover:bg-gold hover:text-navy transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-md hover:bg-gold hover:text-navy transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <Button variant="navy" className="w-full gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <span className="text-muted-foreground text-sm">{product.category}</span>
                      <h3 className="font-heading text-lg text-foreground mt-1 group-hover:text-gold transition-colors">
                        <Link to={`/shop/${product.id}`}>{product.name}</Link>
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-gold" : "text-muted"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="font-heading text-xl text-foreground">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground line-through text-sm">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;