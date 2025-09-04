"use client"

import { ReactLenis } from "lenis/dist/lenis-react"
import { ReactNode } from "react"

interface SmoothScrollProps {
  children: ReactNode
  className?: string
  options?: {
    lerp?: number
    duration?: number
    smoothWheel?: boolean
    smoothTouch?: boolean
    touchMultiplier?: number
  }
}

export default function SmoothScroll({ 
  children, 
  className = "",
  options = {
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2
  }
}: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: options.lerp,
        duration: options.duration,
        smoothWheel: options.smoothWheel,
        smoothTouch: options.smoothTouch,
        touchMultiplier: options.touchMultiplier,
      }}
    >
      <div className={className}>
        {children}
      </div>
    </ReactLenis>
  )
}