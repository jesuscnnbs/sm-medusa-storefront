"use client"
import { FunctionComponent, memo } from "react"
import Image from "next/image"
import emmy from "../../../../../public/emmy.jpg"
import acapulco from "../../../../../public/acapulco.jpeg"
import creamzy from "../../../../../public/creamzy.jpg"
import chicken from "../../../../../public/chicken_crispy.jpg"
import { Translations } from "types/global"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"
import { useImageFadeIn } from "@lib/hooks"

interface BestSellersProps {
  translations: Translations
}

const BURGERS = [
  {
    id: "acapulco",
    src: acapulco.src,
    name: "Acapulco",
  },
  {
    id: "creamzy",
    src: creamzy.src,
    name: "La Creamzy",
  },
  {
    id: "emmy",
    src: emmy.src,
    name: "La Emmy 🌶️",
  },
  {
    id: "chicken",
    src: chicken.src,
    name: "Chicken Crispy",
  },
]

const ROTATE_CLASS = ["rotate-2", "-rotate-1", "-rotate-1", "rotate-1"]

interface BurgerCardProps {
  src: string
  name: string
  rotateClass: string
}

const BurgerCard: FunctionComponent<BurgerCardProps> = memo(({ src, name, rotateClass }) => {
  const { imageRef, handleImageLoad } = useImageFadeIn()

  return (
    <div className={`${rotateClass} border-2 border-secondary-sm-darker flex flex-col max-w-full gap-4 p-4 mx-auto rounded-lg shadow-drop bg-ui-bg-base`}>
      <Image
        ref={imageRef}
        src={src}
        alt={name}
        loading="lazy"
        width={300}
        height={300}
        className="transition-opacity duration-500 border-2 rounded-md opacity-0 border-dark-sm"
        onLoad={handleImageLoad}
      />
      <h3 className="font-lemonMilk text-secondary-sm-darker">
        {name}
      </h3>
    </div>
  )
})

BurgerCard.displayName = "BurgerCard"

const BestSellers: FunctionComponent<BestSellersProps> = memo(({translations}) => {
  return (
    <section className="relative py-20 bg-ui-bg-base-pressed bg-doodle">

      <div className="max-w-5xl mx-auto mt-20">
        <div className="grid gap-6 small:grid-cols-2">
          {BURGERS.map((burger, index) => (
            <BurgerCard
              key={burger.id}
              src={burger.src}
              name={burger.name}
              rotateClass={ROTATE_CLASS[index]}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-20">
        <BrutalButtonLink href="/menu" data-testid="menu-link" variant="secondary">
         {translations.seeMore}
        </BrutalButtonLink>
      </div>
    </section>
  )
})

BestSellers.displayName = "BestSellers"

export default BestSellers
