import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Drills to Improve Your Game",
    excerpt: "Master these fundamental exercises to take your football skills to the next level this season.",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
    category: "Training",
    author: "Coach Johnson",
    date: "Jan 15, 2026",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "How to Choose the Perfect Football Helmet",
    excerpt: "A comprehensive guide to selecting protective gear that offers maximum safety and comfort.",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    category: "Gear Guide",
    author: "Mike Stevens",
    date: "Jan 12, 2026",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Pre-Game Nutrition for Peak Performance",
    excerpt: "Fuel your body right with these nutrition tips from professional athletes and trainers.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f76?w=800&q=80",
    category: "Nutrition",
    author: "Dr. Sarah Chen",
    date: "Jan 10, 2026",
    readTime: "6 min read",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
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

export const BlogPreview = () => {
  return (
    <section className="section-padding bg-cream">
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
              From Our Blog
            </span>
            <h2 className="font-heading text-4xl md:text-5xl text-navy">
              LATEST <span className="text-gold">INSIGHTS</span>
            </h2>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link to="/blog">View All Articles</Link>
          </Button>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="group bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
            >
              {/* Image */}
              <Link to={`/blog/${post.id}`} className="block relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gold text-navy text-xs font-bold uppercase tracking-wider rounded-full">
                    {post.category}
                  </span>
                </div>
              </Link>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                </div>
                
                <h3 className="font-heading text-xl text-foreground mb-3 group-hover:text-gold transition-colors">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-navy font-medium text-sm group-hover:text-gold transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};