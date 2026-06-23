import crypto from "node:crypto"
import bizSdk from "facebook-nodejs-business-sdk"

type MetaEventPayload = {
  eventName?: string
  eventId?: string
  eventSourceUrl?: string
  userData?: {
    email?: string
    fbc?: string | null
    fbp?: string | null
  }
  customData?: Record<string, unknown>
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex")
}

export async function POST(req: Request) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID

  if (!accessToken || !pixelId) {
    return Response.json({ success: false, error: "Meta CAPI not configured" }, { status: 400 })
  }

  let payload: MetaEventPayload
  try {
    payload = await req.json()
  } catch {
    return Response.json({ success: false, error: "Invalid JSON payload" }, { status: 400 })
  }

  if (!payload.eventName) {
    return Response.json({ success: false, error: "eventName is required" }, { status: 400 })
  }

  const userAgent = req.headers.get("user-agent") ?? undefined
  const forwardedFor = req.headers.get("x-forwarded-for") ?? undefined
  const clientIp = forwardedFor?.split(",")[0]?.trim()

  const UserData = bizSdk.UserData
  const ServerEvent = bizSdk.ServerEvent
  const EventRequest = bizSdk.EventRequest
  const CustomData = bizSdk.CustomData

  bizSdk.FacebookAdsApi.init(accessToken)

  const userData = new UserData()
    .setClientIpAddress(clientIp)
    .setClientUserAgent(userAgent)

  if (payload.userData?.email) {
    userData.setEmails([sha256(payload.userData.email)])
  }
  if (payload.userData?.fbc) {
    userData.setFbc(payload.userData.fbc)
  }
  if (payload.userData?.fbp) {
    userData.setFbp(payload.userData.fbp)
  }

  const customData = new CustomData()
  if (payload.customData) {
    Object.entries(payload.customData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // SDK does not expose typed setters for every possible custom field.
        ;(customData as unknown as Record<string, (v: unknown) => void>)[`set${key[0].toUpperCase()}${key.slice(1)}`]?.(value)
      }
    })
  }

  const serverEvent = new ServerEvent()
    .setEventName(payload.eventName)
    .setEventId(payload.eventId)
    .setEventTime(Math.floor(Date.now() / 1000))
    .setUserData(userData)
    .setCustomData(customData)
    .setEventSourceUrl(payload.eventSourceUrl)
    .setActionSource("website")

  const eventRequest = new EventRequest(accessToken, pixelId).setEvents([serverEvent])

  try {
    const response = await eventRequest.execute()
    return Response.json({ success: true, response })
  } catch (error) {
    console.error("Meta CAPI error:", error)
    return Response.json({ success: false, error: "Failed to send Meta event" }, { status: 500 })
  }
}
