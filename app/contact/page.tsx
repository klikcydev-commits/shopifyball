import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactOptions } from "@/components/contact/contact-options"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactFaq } from "@/components/contact/contact-faq"
import { ContactNewsletter } from "@/components/contact/contact-newsletter"

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <ContactHero />
        <ContactOptions />
        <ContactForm />
        <ContactFaq />
        <ContactNewsletter />
      </main>
      <Footer />
    </>
  )
}
