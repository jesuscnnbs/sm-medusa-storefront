'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { XMark } from '@medusajs/icons'
import { Button } from '@medusajs/ui'
import BrutalButton from '@modules/admin/components/brutal-button'

const COOKIE_CONSENT_KEY = 'santa_monica_cookie_consent'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const t = useTranslations('CookieConsent')

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setShowBanner(false)
    // Trigger custom event to load analytics
    window.dispatchEvent(new CustomEvent('cookieConsentAccepted'))
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[99999] animate-in slide-in-from-bottom duration-500">
      <div className="border-t-2 border-dark-sm bg-gradient-to-t from-light-sm-darker to-light-sm-lighter">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            {/* Content */}
            <div className="flex-1 text-dark-sm-darker">
              <h3 className="mb-2 text-lg font-semibold font-lemon-milk">
                {t('title')}
              </h3>
              <p className="text-sm leading-relaxed text-dark-sm/80">
                {t('description')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-stretch w-full gap-3 sm:flex-row sm:items-center sm:w-auto">
              <BrutalButton
                onClick={handleAccept}
                variant='neutral'
                size='sm'
              >
                {t('accept')}
              </BrutalButton>
              <BrutalButton
                onClick={handleDecline}
                variant="primary"
                size='sm'
              >
                {t('decline')}
              </BrutalButton>
              <button
                onClick={handleDecline}
                className="p-2 text-gray-400 transition-colors sm:ml-2 hover:text-white"
                aria-label={t('close')}
              >
                <XMark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
