"use client"
import React from 'react'
import { Caveat } from 'next/font/google'
import {useTranslations} from 'next-intl';
import clsx from 'clsx'
import PageTitle from '@modules/common/components/page-title';


const caveat = Caveat({
  subsets: ['latin'],
  weight: '700',
})


export default function CommingSoon() {
  const t = useTranslations('Common')
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <h1
      >
        <PageTitle text={t('soon')} classNames="santa-monica font-lemonMilk text-2xl md:text-8xl" />
      </h1>
    </div>
  )
}

