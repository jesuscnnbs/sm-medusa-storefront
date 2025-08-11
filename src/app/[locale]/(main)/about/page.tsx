import PageTitle from "@modules/common/components/page-title"
import {SmoothScrollHero} from "@modules/about/components/hero"
import {getTranslations} from 'next-intl/server';
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Santa Mónica",
  description:
    "Comida americana con sabor venezolano. Hamburguesas gourmet, carne de la mejor calidad, pollo crujiente, opciones vegetarianas, postres, tequeños y mucho más. ¡Pide a domicilio o recoge en local!",
}

export default async function Menu() {
  const t = await getTranslations('About')
  return (
    <>
      {/** Section Tittle */}
      <section className="flex flex-col items-center justify-center px-2 pt-20 pb-20 lg:px-10 bg-secondary-sm">
        <h1 className="santa-monica monica font-lemonMilk">
          <PageTitle text={t('title')} />
        </h1>
      </section>
      <section>
        <SmoothScrollHero />
      </section>
    </>
  )
}
