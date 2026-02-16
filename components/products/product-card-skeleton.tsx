"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProductCardSkeletonProps {
  size?: "default" | "large"
  className?: string
}

export function ProductCardSkeleton({ size = "default", className }: ProductCardSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden border-border bg-card", className)}>
      <CardContent className="p-0">
        <div
          className={cn(
            "animate-pulse bg-muted",
            size === "large" ? "aspect-[3/4]" : "aspect-square"
          )}
        />
        <div className="flex flex-col p-4">
          <div className="h-5 w-3/4 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-1/2 rounded-md bg-muted" />
          <div className="mt-4 flex items-baseline gap-2">
            <div className="h-6 w-20 rounded-md bg-muted" />
            <div className="h-4 w-14 rounded-md bg-muted" />
          </div>
          <div className="mt-2 h-3 w-16 rounded-md bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}
