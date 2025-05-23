import React from "react"
import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import BestSellers from "@modules/home/components/best-sellers"
import Story from "@modules/home/components/story"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import PetFriendly from "@modules/home/components/pet-friendly"
import {getTranslations} from 'next-intl/server';

export const metadata: Metadata = {
  title: "Santa Mónica",
  description:
    "Comida americana con sabor venezolano. Hamburguesas gourmet, carne de la mejor calidad, pollo crujiente, opciones vegetarianas, postres, tequeños y mucho más. ¡Pide a domicilio o recoge en local!",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const [t, tHome] = await Promise.all([
    getTranslations('Common'),
    getTranslations('Home')
  ])
  const params = await props.params

  const { countryCode } = params

  const { collections } = await listCollections({
    fields: "*products",
  })
  const region = await getRegion(countryCode)

  if (!collections || !region) {
    return null
  }
  return (
    <React.Fragment>
      <Hero translation={t('callToActionButton')}/>
      <BestSellers translations={{
        parallaxOne: tHome('BestSellers.ParallaxOne'),
        parallaxTwo: tHome('BestSellers.ParallaxTwo'),
      }}/>
      <Story translations={{
        parallaxOne: tHome('Story.ParallaxOne'),
        parallaxTwo: tHome('Story.ParallaxTwo'),
      }}/>
      <PetFriendly />
    </React.Fragment>
  )
}


