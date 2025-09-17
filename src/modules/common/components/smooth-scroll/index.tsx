"use client"

import { ReactLenis } from "lenis/dist/lenis-react"
import { ReactNode, useEffect, useState, useCallback } from "react"

interface SmoothScrollProps {
  children: ReactNode
  className?: string
  disableOnMobile?: boolean
}

export default function SmoothScroll({ 
  children, 
  className = "",
  disableOnMobile = true
}: SmoothScrollProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Simple options matching the about page
  const lenisOptions = {
    lerp: 0.05,
  }

  // Don't render Lenis until mounted or if on mobile (when disabled)
  if (!isMounted || (disableOnMobile && isMobile)) {
    return <div className={className}>{children}</div>
  }

  return (
    <ReactLenis
      root
      options={lenisOptions}
    >
      <div className={className}>
        {children}
      </div>
    </ReactLenis>
  )
}