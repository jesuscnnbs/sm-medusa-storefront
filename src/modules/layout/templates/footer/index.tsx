import { Text } from "@medusajs/ui"
import { useTranslations } from 'next-intl'
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  const t = useTranslations('Common')

  return (
    <footer className="w-full border-t border-ui-border-base bg-ui-bg-base">
      <div className="flex flex-col w-full content-container bg-footer">
        <div className="flex flex-col items-center justify-between w-full gap-6 mb-16 text-ui-fg-muted pt-72 md:flex-row">
          {/* Left: Copyright */}
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} <span className="font-lemonMilk">Santa Mónica</span> All rights reserved.
          </Text>

          {/* Center: Policy Links */}
          <div className="flex gap-6 text-sm font-medium">
            <LocalizedClientLink
              href="/cookies-policy"
              className="transition-colors hover:text-primary-sm hover:underline"
            >
              {t('cookiesPolicy')}
            </LocalizedClientLink>
            <span className="text-ui-fg-muted">|</span>
            <LocalizedClientLink
              href="/privacy-policy"
              className="transition-colors hover:text-primary-sm hover:underline"
            >
              {t('privacyPolicy')}
            </LocalizedClientLink>
          </div>

          {/* Right: Made with love */}
          <Text className="txt-compact-small">Made with love by jesuscnnbs</Text>
        </div>
      </div>
    </footer>
  )
}
