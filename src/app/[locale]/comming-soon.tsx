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
    <div className="flex items-center justify-center min-h-screen bg-ui-bg-base ">
      <h1
      >
        <PageTitle text={t('soon')} classNames={clsx(
          'text-5xl md:text-8xl font-bold text-secondary-sm-darker tracking-tighter drop-shadow-[0px_7px_2px_rgba(0,0,0,0.2)] lg:drop-shadow-[0px_14px_2px_rgba(0,0,0,0.2)]',
          caveat.className
        )} />
      </h1>
    </div>
  )
}

