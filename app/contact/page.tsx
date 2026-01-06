'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="bg-navy text-primary-foreground py-20">
          <div className="container-custom">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
                Get In Touch
              </span>
              <h1 className="font-heading text-5xl md:text-6xl mb-6">
                Contact <span className="text-gold">Us</span>
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Have a question about our products? Need help with an order? 
                We're here to help!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-background rounded-xl p-8 shadow-lg">
                <h2 className="font-heading text-2xl text-navy mb-6">Send us a Message</h2>
                
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h3 className="font-heading text-xl text-navy mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Name
                        </label>
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        placeholder="Your message..."
                        rows={5}
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="navy"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-2xl text-navy mb-6">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    Our customer service team is available Monday through Friday, 
                    9am to 6pm EST.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-navy mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        123 Stadium Way<br />
                        Dallas, TX 75201
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-navy mb-1">Phone</h3>
                      <a href="tel:+1234567890" className="text-muted-foreground hover:text-gold transition-colors">
                        (123) 456-7890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-navy mb-1">Email</h3>
                      <a href="mailto:support@lemah.com" className="text-muted-foreground hover:text-gold transition-colors">
                        support@lemah.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* FAQ Card */}
                <div className="bg-navy rounded-xl p-6 text-primary-foreground">
                  <h3 className="font-heading text-xl mb-4">Frequently Asked Questions</h3>
                  <ul className="space-y-3 text-primary-foreground/80">
                    <li>• How long does shipping take?</li>
                    <li>• What's your return policy?</li>
                    <li>• Do you offer team discounts?</li>
                    <li>• How do I track my order?</li>
                  </ul>
                  <Button variant="hero" size="sm" className="mt-4">
                    View All FAQs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

