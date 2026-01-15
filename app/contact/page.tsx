import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/ui/page-hero'
import { Mail, Phone, MapPin } from 'lucide-react'
import { getPageByHandle } from '@/lib/shopify'
import { ContactForm } from './contact-form'
import type { Metadata } from 'next'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact Us | LeMah',
  description: 'Get in touch with LeMah - Premium football gear for champions',
}

export default async function ContactPage() {
  // Fetch page content from Shopify
  const page = await getPageByHandle('contact')

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <PageHero 
          title={page?.title || 'Contact Us'}
          subtitle={page?.bodySummary || 'Have a question about our products? Need help with an order? We're here to help!'}
          badge="Get In Touch"
        />

        {/* Contact Section */}
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ContactForm />

              {/* Contact Info */}
              <div className="space-y-8">
                {page?.body && (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.body }}
                  />
                )}
                
                {!page?.body && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
