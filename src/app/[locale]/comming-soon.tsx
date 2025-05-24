import React from 'react'
import { Caveat } from 'next/font/google'
import {getTranslations} from 'next-intl/server';
import clsx from 'clsx'


const caveat = Caveat({
  subsets: ['latin'],
  weight: '700',
})


export default async function CommingSoon() {
  const t = await getTranslations('Common')
  return (
    <div className="flex items-center justify-center min-h-screen bg-ui-bg-base">
      <h1
        className={clsx(
          'text-4xl md:text-7xl font-bold text-secondary-sm',
          caveat.className
        )}
      >
        {t('soon')}
      </h1>
    </div>
  )
}

