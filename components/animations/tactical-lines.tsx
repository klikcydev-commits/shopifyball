"use client"

import { useEffect, useRef } from "react"

export function TacticalLines() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = svg.querySelectorAll("path")
    paths.forEach((path, index) => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length}`
      path.style.animation = `tactical-line-draw 2s ease-out ${index * 0.2}s forwards`
    })
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
      viewBox="0 0 1000 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Tactical formation lines */}
      <path
        d="M100 300 L300 200 L500 300 L700 200 L900 300"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gold"
      />
      <path d="M200 400 L400 350 L600 400 L800 350" stroke="currentColor" strokeWidth="1" className="text-gold" />
      <path d="M500 100 L500 500" stroke="currentColor" strokeWidth="0.5" className="text-gold/50" />
      <path d="M100 300 C100 300, 500 100, 900 300" stroke="currentColor" strokeWidth="1" className="text-gold/70" />
      {/* Center circle */}
      <circle cx="500" cy="300" r="60" stroke="currentColor" strokeWidth="1" fill="none" className="text-gold/40" />
    </svg>
  )
}
