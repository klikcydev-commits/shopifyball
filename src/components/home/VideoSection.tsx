import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1461896836934-fffff797ad11?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-navy/80" />
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              hsla(45, 90%, 50%, 0.1) 20px,
              hsla(45, 90%, 50%, 0.1) 40px
            )`
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
              Our Story
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-6">
              BUILT BY <span className="text-gold">ATHLETES</span>,<br />
              FOR ATHLETES
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg">
              Every piece of gear we create is tested on the field by professional players. 
              We don't just make equipment—we engineer performance.
            </p>
            <div className="flex flex-wrap gap-8 mb-10">
              <div>
                <span className="block font-heading text-4xl text-gold">15+</span>
                <span className="text-primary-foreground/60 text-sm">Years Experience</span>
              </div>
              <div>
                <span className="block font-heading text-4xl text-gold">500K+</span>
                <span className="text-primary-foreground/60 text-sm">Athletes Equipped</span>
              </div>
              <div>
                <span className="block font-heading text-4xl text-gold">32</span>
                <span className="text-primary-foreground/60 text-sm">Pro Teams</span>
              </div>
            </div>
            <Button variant="hero" size="lg">
              About Us
            </Button>
          </motion.div>

          {/* Right - Video Player */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gold/20">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url(https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&q=80)",
                }}
              />
              <div className="absolute inset-0 bg-navy/40" />
              
              {/* Play Button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-gold rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                >
                  <Play className="w-8 h-8 text-navy fill-navy ml-1" />
                </motion.div>
                
                {/* Ripple Effect */}
                <div className="absolute w-20 h-20 rounded-full border-2 border-gold/50 animate-ping" />
              </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-gold/30 rounded-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-gold/20 rounded-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 p-4"
          onClick={() => setIsPlaying(false)}
        >
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-gold rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="w-6 h-6 text-navy" />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-navy rounded-2xl flex items-center justify-center">
            <p className="text-primary-foreground text-xl">Video Player Placeholder</p>
          </div>
        </motion.div>
      )}
    </section>
  );
};