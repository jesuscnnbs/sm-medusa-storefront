import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import ParallaxText from "@modules/common/components/parallax-text"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Santa Mónica",
  description:
    "Comida americana con sabor venezolano. Hamburguesas gourmet, carne de la mejor calidad, pollo crujiente, opciones vegetarianas, postres, tequeños y mucho más. ¡Pide a domicilio o recoge en local!",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
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
    <>
      <Hero />
      <section className="py-20 bg-ui-bg-base">
        <ParallaxText baseVelocity={-1}>Burguers · Tequeños ·</ParallaxText>
        <ParallaxText baseVelocity={1}>California · Venezuela ·</ParallaxText>
      </section>
    </>
  )
}
