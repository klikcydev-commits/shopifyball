import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const categories = ["All", "Training", "Gear Guide", "Nutrition", "Pro Tips", "News"];

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Drills to Improve Your Game This Season",
    excerpt: "Master these fundamental exercises to take your football skills to the next level. From footwork to throwing mechanics, we cover it all.",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
    category: "Training",
    author: "Coach Johnson",
    date: "Jan 15, 2026",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    title: "How to Choose the Perfect Football Helmet",
    excerpt: "A comprehensive guide to selecting protective gear that offers maximum safety and comfort for players at every level.",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    category: "Gear Guide",
    author: "Mike Stevens",
    date: "Jan 12, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 3,
    title: "Pre-Game Nutrition for Peak Performance",
    excerpt: "Fuel your body right with these nutrition tips from professional athletes and certified sports trainers.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f76?w=800&q=80",
    category: "Nutrition",
    author: "Dr. Sarah Chen",
    date: "Jan 10, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 4,
    title: "Breaking Down the Zone Defense",
    excerpt: "Professional coach explains the intricacies of zone coverage and how to exploit weaknesses in defensive schemes.",
    image: "https://images.unsplash.com/photo-1461896836934-fffff797ad11?w=800&q=80",
    category: "Pro Tips",
    author: "Coach Williams",
    date: "Jan 8, 2026",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: 5,
    title: "New 2026 Cleat Technology Revealed",
    excerpt: "An inside look at the latest innovations in football cleat design, featuring interviews with our product engineers.",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
    category: "News",
    author: "Tech Team",
    date: "Jan 5, 2026",
    readTime: "4 min read",
    featured: false,
  },
  {
    id: 6,
    title: "Off-Season Training: Building Your Foundation",
    excerpt: "How to use the off-season to build strength, speed, and endurance that will carry you through the entire season.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    category: "Training",
    author: "Coach Johnson",
    date: "Jan 3, 2026",
    readTime: "6 min read",
    featured: false,
  },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

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
                The Playbook
              </span>
              <h1 className="font-heading text-5xl md:text-6xl text-primary-foreground mb-6">
                LATEST <span className="text-gold">INSIGHTS</span>
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Training tips, gear guides, and expert advice from professional athletes and coaches.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Categories */}
        <section className="py-8 bg-cream border-b border-border">
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
              
              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && activeCategory === "All" && !searchQuery && (
          <section className="py-16 bg-cream">
            <div className="container-custom">
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-8 items-center bg-background rounded-3xl overflow-hidden shadow-lg border border-border"
              >
                <Link to={`/blog/${featuredPost.id}`} className="block aspect-[16/10] lg:aspect-auto lg:h-full overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-8 lg:p-12">
                  <span className="inline-block px-3 py-1 bg-gold text-navy text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    Featured
                  </span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4 hover:text-gold transition-colors">
                    <Link to={`/blog/${featuredPost.id}`}>{featuredPost.title}</Link>
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 text-navy font-semibold uppercase tracking-wider hover:text-gold transition-colors group"
                  >
                    Read Article
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            {regularPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
                  >
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

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                      
                      <h3 className="font-heading text-xl text-foreground mb-3 group-hover:text-gold transition-colors line-clamp-2">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </span>
                        <Link
                          to={`/blog/${post.id}`}
                          className="inline-flex items-center gap-1 text-navy font-medium text-sm group-hover:text-gold transition-colors"
                        >
                          Read
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;