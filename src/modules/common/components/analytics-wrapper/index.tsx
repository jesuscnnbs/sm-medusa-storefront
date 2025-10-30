'use client'

import { useState, useEffect } from 'react'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const COOKIE_CONSENT_KEY = 'santa_monica_cookie_consent'

export default function AnalyticsWrapper() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (consent === 'accepted') {
      setHasConsent(true)
    }

    // Listen for cookie consent acceptance
    const handleConsentAccepted = () => {
      setHasConsent(true)
    }

    window.addEventListener('cookieConsentAccepted', handleConsentAccepted)

    return () => {
      window.removeEventListener('cookieConsentAccepted', handleConsentAccepted)
    }
  }, [])

  // Only render analytics if user has consented
  if (!hasConsent) {
    return null
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
