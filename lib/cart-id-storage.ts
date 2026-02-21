/**
 * Persist cart ID so cart survives refresh.
 * Prefer cookie (same-site, sent with requests if needed); fallback localStorage.
 */

const CART_ID_KEY = "lemah_cart_id"
const CART_COOKIE_MAX_AGE_DAYS = 365

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, maxAgeDays: number) {
  if (typeof document === "undefined") return
  const maxAge = maxAgeDays * 24 * 60 * 60
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; max-age=0`
}

export function loadCartId(): string | null {
  if (typeof window === "undefined") return null
  const fromCookie = getCookie(CART_ID_KEY)
  if (fromCookie) return fromCookie
  return localStorage.getItem(CART_ID_KEY)
}

export function saveCartId(id: string | null) {
  if (typeof window === "undefined") return
  if (id) {
    setCookie(CART_ID_KEY, id, CART_COOKIE_MAX_AGE_DAYS)
    localStorage.setItem(CART_ID_KEY, id)
  } else {
    removeCookie(CART_ID_KEY)
    localStorage.removeItem(CART_ID_KEY)
  }
}
