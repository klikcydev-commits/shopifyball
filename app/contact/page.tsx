import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactFaq } from "@/components/contact/contact-faq"
import { ContactNewsletter } from "@/components/contact/contact-newsletter"
import { getPageMetadata } from "@/lib/seo/build-metadata"

export const metadata: Metadata = getPageMetadata("/contact")

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <ContactHero />
        <ContactForm />
        <ContactFaq />
        <ContactNewsletter />
      </main>
      <Footer />
    </>
  )
}
