import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Footballs",
    description: "Official game balls & training equipment",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    link: "/shop/footballs",
    count: "24 Products",
  },
  {
    id: 2,
    name: "Helmets",
    description: "Maximum protection, elite performance",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
    link: "/shop/helmets",
    count: "18 Products",
  },
  {
    id: 3,
    name: "Gloves",
    description: "Superior grip for every play",
    image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f76?w=800&q=80",
    link: "/shop/gloves",
    count: "32 Products",
  },
  {
    id: 4,
    name: "Cleats",
    description: "Speed & traction engineered",
    image: "https://images.unsplash.com/photo-1461896836934- voices-from-the-field-c20d0f67fd9?w=800&q=80",
    link: "/shop/cleats",
    count: "45 Products",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const FeaturedCategories = () => {
  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-navy/10 rounded-full text-navy text-sm font-medium uppercase tracking-wider mb-4">
            Shop by Category
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-navy mb-4">
            GEAR UP FOR <span className="text-gold">VICTORY</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From practice to game day, find everything you need to perform at your best.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                to={category.link}
                className="group block relative h-[400px] rounded-2xl overflow-hidden hover-lift"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-gold text-sm font-medium tracking-wider mb-2">
                    {category.count}
                  </span>
                  <h3 className="font-heading text-2xl text-primary-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-4 transition-all duration-300">
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/50 rounded-2xl transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};