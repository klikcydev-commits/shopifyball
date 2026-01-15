import { redirect } from 'next/navigation'

// Redirect /pages/the-11-kit to /kit
export default function The11KitRedirect() {
  redirect('/kit')
}
