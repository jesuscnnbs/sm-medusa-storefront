import { getTranslations } from 'next-intl/server'
import { Metadata } from "next/types"
import { BrutalButtonLink } from '@modules/admin/components/brutal-button-link'

export const metadata: Metadata = {
  title: "Política de Privacidad - Santa Mónica",
  description: "Política de Privacidad de Santa Mónica. Información sobre cómo protegemos y utilizamos tu información personal.",
}

export default async function PrivacyPolicy() {
  const t = await getTranslations('PrivacyPolicy')

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
          {/* Data Collection */}
          <div className="p-6 border-2 rounded-lg bg-light-sm-lighter border-dark-sm shadow-brutal-secondary">
            <h2 className="mb-3 text-2xl font-bold uppercase text-secondary-sm">
              {t('dataCollection.title')}
            </h2>
            <p className="mb-4 text-base font-medium text-dark-sm/80">
              {t('dataCollection.description')}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('dataCollection.personal')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('dataCollection.usage')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('dataCollection.technical')}
                </span>
              </li>
            </ul>
          </div>

          {/* Data Use */}
          <div className="p-6 border-2 rounded-lg bg-light-sm-lighter border-dark-sm shadow-brutal-secondary">
            <h2 className="mb-3 text-2xl font-bold uppercase text-secondary-sm">
              {t('dataUse.title')}
            </h2>
            <p className="mb-4 text-base font-medium text-dark-sm/80">
              {t('dataUse.description')}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('dataUse.service')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('dataUse.improve')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('dataUse.communication')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('dataUse.security')}
                </span>
              </li>
            </ul>
          </div>

          {/* Data Protection */}
          <div className="p-6 border-2 rounded-lg bg-light-sm-lighter border-dark-sm shadow-brutal-secondary">
            <h2 className="mb-3 text-2xl font-bold uppercase text-secondary-sm">
              {t('dataProtection.title')}
            </h2>
            <p className="text-base font-medium leading-relaxed text-dark-sm/80">
              {t('dataProtection.description')}
            </p>
          </div>

          {/* Your Rights */}
          <div className="p-6 border-2 rounded-lg bg-light-sm-lighter border-dark-sm shadow-brutal-secondary">
            <h2 className="mb-3 text-2xl font-bold uppercase text-secondary-sm">
              {t('yourRights.title')}
            </h2>
            <p className="mb-4 text-base font-medium text-dark-sm/80">
              {t('yourRights.description')}
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('yourRights.access')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('yourRights.rectify')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('yourRights.delete')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-sm">•</span>
                <span className="text-base font-medium text-dark-sm/80">
                  {t('yourRights.object')}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="p-6 border-2 rounded-lg bg-light-sm-lighter border-dark-sm shadow-brutal-secondary">
            <h2 className="mb-3 text-2xl font-bold uppercase text-secondary-sm">
              {t('contact.title')}
            </h2>
            <p className="text-base font-medium leading-relaxed text-dark-sm/80">
              {t('contact.description')}
            </p>
          </div>
        </div>

        {/* Back to home button */}
        <div className="flex justify-center mt-10">
          <BrutalButtonLink
            href="/"
            variant='secondary'
          >
            ← Volver al inicio
          </BrutalButtonLink>
        </div>
      </div>
    </div>
  )
}
