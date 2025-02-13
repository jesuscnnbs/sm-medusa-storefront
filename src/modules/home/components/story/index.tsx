"use client"
import Image from "next/image"
import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ParallaxTitle from "@modules/common/components/parallax-title"
import picture from "../../../../../public/sm-burgers-home.jpg"

function Story() {
  return (
    <section className="pb-20 bg-light-sm">
      <ParallaxTitle
        textPrimary="Santa Mónica"
        textSecondary="La historia"
        className="-mt-2 -rotate-1"
      />
      <div className="max-w-5xl px-4 mx-auto">
        <Image
          src={picture.src}
          alt="Santa Mónica"
          loading="lazy"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="-mt-5 transition-opacity duration-500 rounded-none opacity-0"
          onLoadingComplete={(image) =>
            image.classList.replace("opacity-0", "opacity-100")
          }
        />
        <p className="mt-10 text-lg text-dark-sm">
          En julio de 2021, unos emprendedores venezolanos decidieron llevar su
          amor por la buena comida a Almería, dando vida a Santa Mónica. Con un
          faro como emblema, este lugar no solo busca ser un punto de referencia
          gastronómico, sino también un espacio donde los sabores del mundo se
          fusionan con ingredientes locales. El faro, presente en su logo,
          simboliza la luz que guía a los amantes de las hamburguesas hacia una
          experiencia única, llena de sabor y calidez.
        </p>
      </div>
      <div className="flex justify-center mt-10">
        <LocalizedClientLink href="/about" data-testid="about-link">
          <Button variant="secondary" className="uppercase rounded-none text-light-sm-lighter">
            Saber más de Santa Mónica
          </Button>
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default Story
