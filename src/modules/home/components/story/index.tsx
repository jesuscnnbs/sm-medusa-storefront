"use client"
import { useRef } from "react"
import Image from "next/image"
import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ParallaxTitle from "@modules/common/components/parallax-title"
import picture from "../../../../../public/sm-burgers-home.jpg"
import { Translations } from "types/global"

interface StoryProps {
  translations: Translations
}


function Story({translations}: StoryProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  
  return (
    <section className="pb-20 bg-light-sm">
      <ParallaxTitle
        textPrimary={translations.parallaxOne}
        textSecondary={translations.parallaxTwo}
        className="-rotate-1"
      />
      <div className="max-w-5xl px-4 mx-auto">
        <Image
          ref={imageRef}
          src={picture.src}
          alt="Santa Mónica"
          loading="lazy"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="-mt-5 transition-opacity duration-500 rounded-none opacity-0"
          onLoad={() => {
            if (imageRef.current) {
              imageRef.current.classList.replace("opacity-0", "opacity-100")
            }
          }}
        />
        <p className="mt-10 text-lg text-dark-sm">
          {translations.description}
        </p>
      </div>
      <div className="flex justify-center mt-10">
        <LocalizedClientLink href="/about" data-testid="about-link">
          <Button variant="secondary" className="uppercase rounded-none text-light-sm-lighter">
            {translations.learnMore}
          </Button>
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default Story
