import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/ui/page-hero'

export const metadata = {
  title: 'About Us | LeMah',
  description: 'Learn about LeMah - Official Real Madrid accessories and merchandise for true Madridistas',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <PageHero 
          title="Real Madrid Accessories"
          subtitle="LeMah is your destination for authentic Real Madrid merchandise. We provide official accessories, jerseys, kits, and collectibles for true Madridistas worldwide."
          badge="Our Story"
        />

        {/* Mission Section */}
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-4xl text-navy mb-6">Our Mission</h2>
                <p className="text-muted-foreground text-lg mb-4">
                  We are dedicated to providing authentic Real Madrid accessories and merchandise 
                  to fans around the world. Every product is official and authentic.
                </p>
                <p className="text-muted-foreground text-lg mb-4">
                  As passionate Madridistas ourselves, we understand the importance of quality 
                  and authenticity when it comes to supporting Los Blancos.
                </p>
                <p className="text-muted-foreground text-lg">
                  From match day essentials to collectibles, LeMah brings you the best Real Madrid 
                  merchandise to show your support for the greatest club in the world.
                </p>
              </div>
              <div className="bg-navy rounded-2xl p-8 text-primary-foreground">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="font-heading text-5xl text-gold mb-2">100K+</div>
                    <div className="text-primary-foreground/70">Madridistas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-heading text-5xl text-gold mb-2">35+</div>
                    <div className="text-primary-foreground/70">La Liga Titles</div>
                  </div>
                  <div className="text-center">
                    <div className="font-heading text-5xl text-gold mb-2">14</div>
                    <div className="text-primary-foreground/70">Champions Leagues</div>
                  </div>
                  <div className="text-center">
                    <div className="font-heading text-5xl text-gold mb-2">5★</div>
                    <div className="text-primary-foreground/70">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-background">
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
                <h3 className="font-heading text-xl text-navy mb-4">Authenticity</h3>
                <p className="text-muted-foreground">
                  Every product is official and authentic. We only offer genuine Real Madrid 
                  merchandise to ensure you get the real deal.
                </p>
              </div>
              <div className="bg-cream rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="font-heading text-xl text-navy mb-4">Madridismo</h3>
                <p className="text-muted-foreground">
                  Real Madrid is more than a club—it's a way of life. We're proud to 
                  serve Madridistas worldwide with authentic merchandise.
                </p>
              </div>
              <div className="bg-cream rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💪</span>
                </div>
                <h3 className="font-heading text-xl text-navy mb-4">Heritage</h3>
                <p className="text-muted-foreground">
                  We honor the rich history and tradition of Real Madrid, bringing you 
                  merchandise that celebrates the club's legendary legacy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
