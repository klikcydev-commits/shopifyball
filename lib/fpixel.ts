// Public pixel ID — safe to fallback if env is missing at build time.
const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FB_PIXEL_ID || "1517923196626071"

type PixelParams = Record<string, unknown>

type MetaUserData = {
  email?: string
  fbc?: string | null
  fbp?: string | null
}

type TrackEventOptions = {
  eventId?: string
  userData?: MetaUserData
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function createEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null
  }
  return null
}

function getFbclidFromUrl(): string | null {
  if (typeof window === "undefined") return null
  return new URLSearchParams(window.location.search).get("fbclid")
}

export function getFbc(): string | null {
  const fromCookie = getCookie("_fbc")
  if (fromCookie) return fromCookie

  const fbclid = getFbclidFromUrl()
  if (!fbclid) return null

  // Meta format: fb.1.<timestamp_ms>.<fbclid>
  return `fb.1.${Date.now()}.${fbclid}`
}

export function getFbp(): string | null {
  return getCookie("_fbp")
}

export function pageview() {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return
  window.fbq("track", "PageView")
}

export async function event(
  name: string,
  options: PixelParams = {},
  trackOptions: TrackEventOptions = {}
): Promise<string | null> {
  if (typeof window === "undefined") return null

  const eventId = trackOptions.eventId ?? createEventId()

  if (typeof window.fbq === "function") {
    window.fbq("track", name, options, { eventID: eventId })
  }

  try {
    await fetch("/api/meta-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: name,
        eventId,
        customData: options,
        eventSourceUrl: window.location.href,
        userData: {
          fbc: trackOptions.userData?.fbc ?? getFbc(),
          fbp: trackOptions.userData?.fbp ?? getFbp(),
          email: trackOptions.userData?.email,
        },
      }),
    })
  } catch {
    // Ignore CAPI network failures; browser pixel already fired.
  }

  return eventId
}

export { FB_PIXEL_ID }
