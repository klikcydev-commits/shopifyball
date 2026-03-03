"use client"

import { cn } from "@/lib/utils"

interface ProductCardSkeletonProps {
  size?: "default" | "large"
  className?: string
}

export function ProductCardSkeleton({ size = "default", className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "w-full flex-shrink-0 bg-white rounded-xl overflow-hidden",
        size === "large" ? "w-[200px] sm:w-[280px] md:w-[300px]" : "w-[170px] sm:w-[220px] md:w-[260px]",
        className
      )}
    >
      <div className="relative w-full aspect-[3/4] shrink-0 animate-pulse bg-[#e5e5e5]" />
      <div className="px-3 pt-4 pb-4 md:px-4 md:pt-4 md:pb-5 h-[168px] md:h-[176px] flex flex-col">
        <div className="h-4 w-3/4 mx-auto rounded bg-[#e5e5e5]" />
        <div className="mt-2 flex justify-center gap-2">
          <div className="h-4 w-16 rounded bg-[#e5e5e5]" />
          <div className="h-5 w-20 rounded bg-[#e5e5e5]" />
        </div>
        <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
          <div className="h-10 w-full rounded-lg bg-[#e5e5e5]" />
        </div>
      </div>
    </div>
  )
}
