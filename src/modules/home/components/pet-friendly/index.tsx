"use client"
import { useRef } from "react"
import Image from "next/image"
import ParallaxTitle from "@modules/common/components/parallax-title"
import picture from "../../../../../public/pet-friendly-dog.jpeg"
import { Translations } from "types/global"

interface PetFriendlyProps {
  translations: Translations
}

function PetFriendly({ translations }: PetFriendlyProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  
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
          onLoad={() => {
            if (imageRef.current) {
              imageRef.current.classList.replace("opacity-0", "opacity-30")
            }
          }}
        />
      <ParallaxTitle
        textPrimary={translations.textPrimary}
        textSecondary={translations.textSecondary}
        className="rotate-1"
      />
    </section>
  )
}

export default PetFriendly
