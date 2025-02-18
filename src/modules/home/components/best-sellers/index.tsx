"use client"
import { FunctionComponent } from "react"
import Image from "next/image"
import emmy from "../../../../../public/emmy.jpg"
import acapulco from "../../../../../public/acapulco.jpeg"
import creamzy from "../../../../../public/creamzy.jpg"
import chicken from "../../../../../public/chicken_crispy.jpg"
import picture from "../../../../../public/test.svg"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@medusajs/ui"
import ParallaxTitle from "@modules/common/components/parallax-title"

interface BestSellersProps {}

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

const BestSellers: FunctionComponent<BestSellersProps> = () => {
  return (
    <section className="relative py-20 bg-ui-bg-base-pressed bg-doodle">
      <ParallaxTitle textPrimary="NUESTRAS" textSecondary="HAMBURGUESAS" className="rotate-1"/>
      <div className="max-w-5xl mx-auto mt-20">
        <div className="grid gap-6 small:grid-cols-2">
          {BURGERS.map((burger, index) => {
            return (
              <div key={index} className={`${ROTATE_CLASS[index]} flex flex-col max-w-full gap-4 p-4 mx-auto rounded-none shadow-lg bg-ui-bg-base`}>
                <Image
                  src={burger.src}
                  alt={burger.name}
                  loading="lazy"
                  width="300"
                  height="300"
                  className="transition-opacity duration-500 rounded-none opacity-0"
                  onLoadingComplete={(image) =>
                    image.classList.replace("opacity-0", "opacity-100")
                  }
                />
                <h3 className="font-lemonMilk text-secondary-sm-darker">
                  {burger.name}
                </h3>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex justify-center mt-20">
        <LocalizedClientLink href="/menu" data-testid="menu-link">
          <Button variant="secondary" className="uppercase rounded-none text-light-sm-lighter">Ver más</Button>
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default BestSellers
