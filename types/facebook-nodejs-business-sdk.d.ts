declare module "facebook-nodejs-business-sdk" {
  export class UserData {
    setEmails(emails: string[]): this
    setClientIpAddress(ip?: string): this
    setClientUserAgent(ua?: string): this
    setFbc(fbc: string): this
    setFbp(fbp: string): this
  }

  export class CustomData {
    setValue(value: number): this
    setCurrency(currency: string): this
    setContentIds(ids: string[]): this
    setContentType(type: string): this
    setContentName(name: string): this
    setNumItems(count: number): this
    setSearchString(searchString: string): this
  }

  export class ServerEvent {
    setEventName(name: string): this
    setEventId(id?: string): this
    setEventTime(time: number): this
    setUserData(data: UserData): this
    setCustomData(data: CustomData): this
    setEventSourceUrl(url?: string): this
    setActionSource(source: string): this
  }

  export class EventRequest {
    constructor(accessToken: string, pixelId: string)
    setEvents(events: ServerEvent[]): this
    execute(): Promise<unknown>
  }

  const bizSdk: {
    FacebookAdsApi: {
      init(accessToken: string): void
    }
    UserData: typeof UserData
    CustomData: typeof CustomData
    ServerEvent: typeof ServerEvent
    EventRequest: typeof EventRequest
  }

  export default bizSdk
}
