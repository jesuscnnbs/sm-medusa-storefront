"use client"
import { FunctionComponent, useRef } from "react"
import Image from "next/image"
import emmy from "../../../../../public/emmy.jpg"
import acapulco from "../../../../../public/acapulco.jpeg"
import creamzy from "../../../../../public/creamzy.jpg"
import chicken from "../../../../../public/chicken_crispy.jpg"
import ParallaxTitle from "@modules/common/components/parallax-title"
import { Translations } from "types/global"
import { BrutalButtonLink } from "@modules/admin/components/brutal-button-link"

interface BestSellersProps {
  translations: Translations
}

const BURGERS = [
  {
    src: acapulco.src,
    name: "Acapulco",
  },
  {
    src: creamzy.src,
    name: "La Creamzy",
  },
  {
    src: emmy.src,
    name: "La Emmy 🌶️",
  },
  {
    src: chicken.src,
    name: "Chicken Crispy",
  },
]

const ROTATE_CLASS = ["rotate-2", "-rotate-1", "-rotate-1", "rotate-1"]

const BestSellers: FunctionComponent<BestSellersProps> = ({translations}) => {
  return (
    <section className="relative py-20 bg-ui-bg-base-pressed bg-doodle">
      <ParallaxTitle textPrimary={translations.parallaxOne} textSecondary={translations.parallaxTwo} className="rotate-1"/>
      <div className="max-w-5xl mx-auto mt-20">
        <div className="grid gap-6 small:grid-cols-2">
          {BURGERS.map((burger, index) => {
            const BurgerCard = () => {
              const imageRef = useRef<HTMLImageElement>(null)
              
              return (
                <div className={`${ROTATE_CLASS[index]} border-2 border-dark-sm flex flex-col max-w-full gap-4 p-4 mx-auto rounded-none shadow-drop bg-ui-bg-base`}>
                  <Image
                    ref={imageRef}
                    src={burger.src}
                    alt={burger.name}
                    loading="lazy"
                    width="300"
                    height="300"
                    className="transition-opacity duration-500 border-2 rounded-none opacity-0 border-dark-sm"
                    onLoad={() => {
                      if (imageRef.current) {
                        imageRef.current.classList.replace("opacity-0", "opacity-100")
                      }
                    }}
                  />
                  <h3 className="font-lemonMilk text-secondary-sm-darker">
                    {burger.name}
                  </h3>
                </div>
              )
            }
            
            return <BurgerCard key={index} />
          })}
        </div>
      </div>
      <div className="flex justify-center mt-20">
        <BrutalButtonLink href="/menu" data-testid="menu-link" variant="secondary">
         {translations.seeMore}
        </BrutalButtonLink>
      </div>
    </section>
  )
}

export default BestSellers
