"use client"

import { useState, type FormEvent } from "react"
import { Check, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const subjects = [
  { value: "order", label: "Order Question" },
  { value: "product", label: "Product Inquiry" },
  { value: "11kit", label: "11Kit Help" },
  { value: "collab", label: "Collaboration" },
  { value: "other", label: "Other" },
]

export function ContactForm() {
  const { ref, isRevealed } = useScrollReveal<HTMLElement>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    orderNumber: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address"
    if (!formData.subject) newErrors.subject = "Please select a subject"
    if (!formData.message.trim()) newErrors.message = "Message is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (isSubmitted) {
    return (
      <section ref={ref} className="py-20 md:py-32 bg-secondary/50">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 bg-background rounded-2xl border border-border">
            {/* Success animation */}
            <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
              <Check className="h-10 w-10 text-gold" />
            </div>

            <h2 className="text-2xl font-bold mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              Message Sent!
            </h2>
            <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              Thanks for reaching out. We'll get back to you within 24 hours.
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({ name: "", email: "", subject: "", orderNumber: "", message: "" })
              }}
              className="mt-8 text-sm text-gold hover:text-gold-dark transition-colors animate-in fade-in duration-500 delay-300"
            >
              Send another message
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="py-20 md:py-32 bg-secondary/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold mb-4 block">Get in Touch</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Send Us a Message</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "p-8 md:p-10 bg-background rounded-2xl border border-border transition-all duration-700",
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "150ms" }}
        >
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={cn(
                  "w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors",
                  errors.name ? "border-destructive" : "border-border",
                )}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={cn(
                  "w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors",
                  errors.email ? "border-destructive" : "border-border",
                )}
                placeholder="john@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject <span className="text-destructive">*</span>
              </label>
              <select
                id="subject"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                className={cn(
                  "w-full px-4 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors appearance-none",
                  errors.subject ? "border-destructive" : "border-border",
                  !formData.subject && "text-muted-foreground",
                )}
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="mt-1 text-sm text-destructive">{errors.subject}</p>}
            </div>

            {/* Order Number (optional) */}
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">
                Order Number <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <input
                id="orderNumber"
                type="text"
                value={formData.orderNumber}
                onChange={(e) => handleChange("orderNumber", e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                placeholder="#LMH-12345"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className={cn(
                  "w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors resize-none",
                  errors.message ? "border-destructive" : "border-border",
                )}
                placeholder="How can we help?"
              />
              {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-medium uppercase tracking-wider hover:bg-navy-light disabled:opacity-70 disabled:cursor-not-allowed transition-colors btn-press gold-glow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
