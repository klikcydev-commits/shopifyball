import { redirect } from 'next/navigation'

// Redirect /pages/* URLs to clean URLs
const pageMap: Record<string, string> = {
  'the-11-kit': '/kit',
  'contact': '/contact',
  'about': '/about',
  'about-us': '/about',
  'contact-us': '/contact',
}

export default function PagesRedirect({ params }: { params: { slug: string[] } }) {
  const pageHandle = params.slug.join('/')
  
  // Check if we have a mapping for this page
  if (pageMap[pageHandle]) {
    redirect(pageMap[pageHandle])
  }
  
  // If no mapping, try to redirect to a page with that handle
  // or redirect to home
  redirect('/')
}
