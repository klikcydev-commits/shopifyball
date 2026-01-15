"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, isRevealed }
}
