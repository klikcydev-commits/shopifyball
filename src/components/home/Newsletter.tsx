import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast.success("Thanks for subscribing! Check your email for exclusive offers.");
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1508098682722-e99c643e7f76?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy" />
      </div>

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
            Stay Updated
          </span>
          
          <h2 className="font-heading text-4xl md:text-5xl text-primary-foreground mb-4">
            JOIN THE <span className="text-gold">TEAM</span>
          </h2>
          
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for exclusive deals, new product launches, and training tips from the pros.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-gold"
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="gap-2"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-5 h-5" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <Send className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-primary-foreground/50 text-sm mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};