import { getTranslations } from 'next-intl/server'
import { Metadata } from "next/types"
import { BrutalButtonLink } from '@modules/admin/components/brutal-button-link'

export const metadata: Metadata = {
  title: "Política de Cookies - Santa Mónica",
  description: "Política de Cookies de Santa Mónica. Información sobre cómo utilizamos las cookies en nuestro sitio web.",
}

export default async function CookiesPolicy() {
  const t = await getTranslations('CookiesPolicy')

  return (
    <div className="min-h-screen px-4 py-20 bg-light-sm">
      <div className="max-w-4xl mx-auto">
        {/* Header Box */}
        <div className="p-8 mb-8 border-2 rounded-lg bg-light-sm-lighter border-dark-sm shadow-brutal-primary">
          <h1 className="mb-4 text-4xl font-black uppercase text-primary-sm font-lemonMilk">
            {t('title')}
          </h1>
          <p className="text-lg font-medium text-dark-sm/80">
            {t('intro')}
          </p>
          <p className="mt-4 text-sm font-medium text-dark-sm/60">
            {t('lastUpdated')}: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* What are cookies */}
          <div className="p-6 border-2 rounded-lg bg-light-sm-lighter border-dark-sm shadow-brutal-secondary">
            <h2 className="mb-3 text-2xl font-bold uppercase text-secondary-sm">
              {t('whatAreCookies.title')}
            </h2>
            <p className="text-base font-medium leading-relaxed text-dark-sm/80">
              {t('whatAreCookies.description')}
            </p>
          </div>

          {/* How we use cookies */}
          <div className="p-6 border-2 rounded-lg bg-light-sm-lighter border-dark-sm shadow-brutal-secondary">
            <h2 className="mb-3 text-2xl font-bold uppercase text-secondary-sm">
              {t('howWeUseCookies.title')}
            </h2>
            <p className="mb-4 text-base font-medium text-dark-sm/80">
              {t('howWeUseCookies.description')}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('howWeUseCookies.essential')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('howWeUseCookies.analytics')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('howWeUseCookies.preferences')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('howWeUseCookies.marketing')}
                </span>
              </li>
            </ul>
          </div>

          {/* Manage cookies */}
          <div className="p-6 border-2 rounded-lg bg-light-sm-lighter border-dark-sm shadow-brutal-secondary">
            <h2 className="mb-3 text-2xl font-bold uppercase text-secondary-sm">
              {t('manageCookies.title')}
            </h2>
            <p className="text-base font-medium leading-relaxed text-dark-sm/80">
              {t('manageCookies.description')}
            </p>
          </div>
        </div>

        {/* Back to home button */}
        <div className="flex justify-center mt-10">
          <BrutalButtonLink
            href="/"
            variant="secondary"
          >
            ← Volver al inicio
          </BrutalButtonLink>
        </div>
      </div>
    </div>
  )
}
