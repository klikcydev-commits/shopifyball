import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

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
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FeaturedProducts = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-2 bg-navy/10 rounded-full text-navy text-sm font-medium uppercase tracking-wider mb-4">
              Featured Products
            </span>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground">
              BEST <span className="text-gold">SELLERS</span>
            </h2>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link to="/shop">View All Products</Link>
          </Button>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
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
        </motion.div>
      </div>
    </section>
  );
};