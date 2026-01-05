'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Integrate with your email service (e.g., Mailchimp, ConvertKit)
    setTimeout(() => {
      toast.success('Successfully subscribed to our newsletter!')
      setEmail('')
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <section className="section-padding bg-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-custom relative">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium uppercase tracking-wider mb-6">
            Stay Updated
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-primary-foreground mb-6">
            JOIN OUR <span className="text-gold">NEWSLETTER</span>
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Get the latest updates on new products, exclusive offers, and football tips from the pros.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button variant="hero" type="submit" disabled={isSubmitting}>
              <Mail className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}


