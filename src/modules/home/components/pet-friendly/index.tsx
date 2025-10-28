"use client"
import { memo } from "react"
import Image from "next/image"
import ParallaxTitle from "@modules/common/components/parallax-title"
import picture from "../../../../../public/pet-friendly-dog.jpeg"
import { Translations } from "types/global"
import { useImageFadeIn } from "@lib/hooks"

interface PetFriendlyProps {
  translations: Translations
}

const PetFriendly = memo(({ translations }: PetFriendlyProps) => {
  const { imageRef, handleImageLoad } = useImageFadeIn("opacity-0", "opacity-30")

  return (
    <section className="relative pt-[400px] pb-[100px] bg-secondary-sm border-y-2 border-secondary-sm-darker">
       <Image
          ref={imageRef}
          src={picture.src}
          alt="Santa Mónica Burger"
          loading="lazy"
          fill={true}
          objectFit="cover"
          className="transition-opacity duration-1000 opacity-0"
          onLoad={handleImageLoad}
        />
      <ParallaxTitle
        textPrimary={translations.textPrimary}
        textSecondary={translations.textSecondary}
        className="rotate-1"
      />
    </section>
  )
})

PetFriendly.displayName = "PetFriendly"

export default PetFriendly
