"use client"

import { cn } from "@/lib/utils"

const COPY = {
  heading: "UAE Delivery Areas",
  body: "We deliver across the UAE, including Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain (and Al Ain). Gift-ready packaging available.",
}

interface UaeDeliveryAreasProps {
  className?: string
  /** "compact" = smaller text for sidebars/footers; "default" = normal section. */
  variant?: "default" | "compact"
}

export function UaeDeliveryAreas({ className, variant = "default" }: UaeDeliveryAreasProps) {
  const isCompact = variant === "compact"
  return (
    <section
      className={cn("rounded-lg border border-border bg-muted/30 p-4", className)}
      aria-labelledby="uae-delivery-heading"
    >
      <h2
        id="uae-delivery-heading"
        className={cn(
          "font-semibold text-foreground",
          isCompact ? "text-xs uppercase tracking-wider mb-1.5" : "text-sm mb-2",
        )}
      >
        {COPY.heading}
      </h2>
      <p
        className={cn(
          "text-muted-foreground",
          isCompact ? "text-xs leading-snug" : "text-sm leading-relaxed",
        )}
      >
        {COPY.body}
      </p>
    </section>
  )
}
