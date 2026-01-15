import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/ui/page-hero'
import { getPageByHandle } from '@/lib/shopify'
import type { Metadata } from 'next'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByHandle('about')
  
  return {
    title: page?.title ? `${page.title} | LeMah` : 'About Us | LeMah',
    description: page?.bodySummary || 'Learn about LeMah - Premium football gear for champions',
  }
}

export default async function AboutPage() {
  // Fetch page content from Shopify
  const page = await getPageByHandle('about')

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <PageHero 
          title={page?.title || 'Built for Champions'}
          subtitle={page?.bodySummary || 'LeMah was founded with a simple mission: to provide athletes with premium football gear that helps them perform at their best.'}
          badge="Our Story"
        />

        {/* Page Content */}
        <section className="section-padding bg-cream">
          <div className="container-custom">
            {page?.body ? (
              <div className="max-w-4xl mx-auto">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.body }}
                />
              </div>
            ) : (
              <>
                {/* Mission Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="font-heading text-4xl text-navy mb-6">Our Mission</h2>
                    <p className="text-muted-foreground text-lg mb-4">
                      We believe every athlete deserves access to high-quality equipment 
                      that enhances their performance and keeps them safe on the field.
                    </p>
                    <p className="text-muted-foreground text-lg mb-4">
                      Our team works directly with professional athletes and coaches to 
                      design and test every product, ensuring it meets the demands of 
                      competitive play.
                    </p>
                    <p className="text-muted-foreground text-lg">
                      From youth leagues to professional teams, LeMah gear is trusted by 
                      athletes who refuse to compromise on quality.
                    </p>
                  </div>
                  <div className="bg-navy rounded-2xl p-8 text-primary-foreground">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="font-heading text-5xl text-gold mb-2">10K+</div>
                        <div className="text-primary-foreground/70">Happy Athletes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-heading text-5xl text-gold mb-2">500+</div>
                        <div className="text-primary-foreground/70">Teams Equipped</div>
                      </div>
                      <div className="text-center">
                        <div className="font-heading text-5xl text-gold mb-2">50+</div>
                        <div className="text-primary-foreground/70">Pro Partners</div>
                      </div>
                      <div className="text-center">
                        <div className="font-heading text-5xl text-gold mb-2">5★</div>
                        <div className="text-primary-foreground/70">Avg Rating</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Values Section */}
                <section className="section-padding bg-background mt-12">
                  <div className="container-custom">
                    <div className="text-center mb-12">
                      <h2 className="font-heading text-4xl text-navy mb-4">Our Values</h2>
                      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        These core principles guide everything we do at LeMah.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="bg-cream rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="text-3xl">🏆</span>
                        </div>
                        <h3 className="font-heading text-xl text-navy mb-4">Excellence</h3>
                        <p className="text-muted-foreground">
                          We never settle for "good enough." Every product undergoes rigorous 
                          testing to meet professional standards.
                        </p>
                      </div>
                      <div className="bg-cream rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="text-3xl">🤝</span>
                        </div>
                        <h3 className="font-heading text-xl text-navy mb-4">Community</h3>
                        <p className="text-muted-foreground">
                          Football is more than a sport—it's a community. We're proud to 
                          support athletes at every level.
                        </p>
                      </div>
                      <div className="bg-cream rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="text-3xl">💪</span>
                        </div>
                        <h3 className="font-heading text-xl text-navy mb-4">Innovation</h3>
                        <p className="text-muted-foreground">
                          We continuously push boundaries, incorporating the latest technology 
                          and materials into our products.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
