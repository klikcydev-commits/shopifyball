import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Users, Trophy, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Precision Engineering",
    description: "Every piece of gear is meticulously designed and tested to deliver peak performance when it matters most.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We're more than a brand—we're a team of athletes, coaches, and fans united by our love for the game.",
  },
  {
    icon: Trophy,
    title: "Championship Quality",
    description: "Our equipment is trusted by professional teams across all levels of competition.",
  },
  {
    icon: Heart,
    title: "Passion Driven",
    description: "Football isn't just what we do—it's who we are. That passion shows in everything we create.",
  },
];

const timeline = [
  { year: "2008", title: "The Beginning", description: "Founded by former NFL players with a vision to revolutionize football gear." },
  { year: "2012", title: "First Pro Contract", description: "Signed our first professional team partnership with the Dallas Cowboys." },
  { year: "2016", title: "Global Expansion", description: "Expanded to international markets, serving athletes in 32 countries." },
  { year: "2020", title: "Innovation Award", description: "Won the Sports Equipment Innovation Award for our Carbon Flex Helmet technology." },
  { year: "2024", title: "500K Athletes", description: "Reached the milestone of equipping over half a million athletes worldwide." },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center bg-navy overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1920&q=80)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/80 to-navy" />
          
          <div className="container-custom relative pt-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
                Our Story
              </span>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight mb-6">
                BUILT FOR <span className="text-gold">CHAMPIONS</span>
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl">
                From humble beginnings to equipping professional athletes worldwide, 
                LeMah has been on a mission to elevate the game since 2008.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6">
                  OUR <span className="text-gold">MISSION</span>
                </h2>
                <p className="text-foreground/80 text-lg mb-6">
                  At LeMah, we believe every athlete deserves equipment that performs 
                  as hard as they do. Our mission is simple: engineer the finest football 
                  gear that empowers players to reach their full potential.
                </p>
                <p className="text-foreground/80 text-lg mb-8">
                  We work alongside professional athletes and coaches to develop, test, 
                  and refine every product. The result? Gear that's not just good enough 
                  for the pros—it's made by them.
                </p>
                <Button asChild variant="navy" size="lg">
                  <Link to="/shop">Shop Our Gear</Link>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80"
                    alt="Football equipment"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gold rounded-2xl -z-10" />
                <div className="absolute -top-6 -right-6 w-32 h-32 border-4 border-navy rounded-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-navy/10 rounded-full text-navy text-sm font-medium uppercase tracking-wider mb-4">
                What We Stand For
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground">
                OUR <span className="text-gold">VALUES</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-card border border-border hover:border-gold/50 transition-colors"
                >
                  <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-heading text-xl text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding bg-navy">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-4">
                Our Journey
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-primary-foreground">
                THE <span className="text-gold">TIMELINE</span>
              </h2>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              {/* Center Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gold/30 hidden md:block" />

              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="bg-navy-light p-6 rounded-2xl border border-gold/20">
                      <span className="font-heading text-3xl text-gold">{item.year}</span>
                      <h3 className="font-heading text-xl text-primary-foreground mt-2 mb-2">{item.title}</h3>
                      <p className="text-primary-foreground/70">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gold rounded-full items-center justify-center">
                    <div className="w-3 h-3 bg-navy rounded-full" />
                  </div>
                  
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-cream">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6">
                READY TO <span className="text-gold">DOMINATE?</span>
              </h2>
              <p className="text-foreground/70 text-lg mb-8">
                Join thousands of athletes who trust LeMah for their football equipment needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="navy" size="xl">
                  <Link to="/shop">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;